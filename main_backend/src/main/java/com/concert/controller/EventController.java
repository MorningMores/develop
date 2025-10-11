package com.concert.controller;

import com.concert.dto.CreateEventRequest;
import com.concert.dto.EventResponse;
import com.concert.model.User;
import com.concert.repository.UserRepository;
import com.concert.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    @Autowired
    public EventController(EventService eventService, UserRepository userRepository) {
        this.eventService = eventService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getEvents(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "12") int size,
                                                         Authentication authentication) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        User currentUser = getCurrentUser(authentication).orElse(null);
        Page<EventResponse> events = eventService.getUpcomingEvents(pageable, currentUser);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable Long id, Authentication authentication) {
        User currentUser = getCurrentUser(authentication).orElse(null);
        try {
            EventResponse event = eventService.getEvent(id, currentUser);
            return ResponseEntity.ok(event);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication authentication) {
        Optional<User> currentUser = getCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<EventResponse> myEvents = eventService.getEventsForOrganizer(currentUser.get());
        return ResponseEntity.ok(myEvents);
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@Valid @RequestBody CreateEventRequest request,
                                         Authentication authentication) {
        Optional<User> currentUser = getCurrentUser(authentication);
        if (currentUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication required");
        }
        try {
            EventResponse response = eventService.createEvent(currentUser.get(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    private Optional<User> getCurrentUser(Principal principal) {
        if (principal == null) {
            return Optional.empty();
        }
        String username = principal.getName();
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username));
    }
}

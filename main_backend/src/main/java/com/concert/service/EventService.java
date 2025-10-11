package com.concert.service;

import com.concert.dto.CreateEventRequest;
import com.concert.dto.EventResponse;
import com.concert.model.Event;
import com.concert.model.User;
import com.concert.repository.EventRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public EventResponse createEvent(User organizer, @Valid CreateEventRequest createEventRequest) {
        if (createEventRequest.getEndDate().isBefore(createEventRequest.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Event event = new Event();
        event.setName(createEventRequest.getName());
        event.setDescription(createEventRequest.getDescription());
        event.setAddress(createEventRequest.getAddress());
        event.setCity(createEventRequest.getCity());
        event.setCountry(createEventRequest.getCountry());
        event.setPhone(createEventRequest.getPhone());
        event.setPersonLimit(createEventRequest.getPersonLimit());
        event.setStartDate(createEventRequest.getStartDate());
        event.setEndDate(createEventRequest.getEndDate());
        event.setTicketPrice(createEventRequest.getTicketPrice());
        event.setCategory(createEventRequest.getCategory());
        event.setOrganizer(organizer);

        Event saved = eventRepository.save(event);
        return toResponse(saved, organizer);
    }

    public Page<EventResponse> getUpcomingEvents(Pageable pageable, User currentUser) {
        Page<Event> page = eventRepository.findAllByOrderByStartDateAsc(pageable);
        List<EventResponse> responses = page.getContent().stream()
                .map(event -> toResponse(event, currentUser))
                .collect(Collectors.toList());
        return new PageImpl<>(responses, pageable, page.getTotalElements());
    }

    public List<EventResponse> getEventsForOrganizer(User organizer) {
        return eventRepository.findByOrganizerOrderByStartDateAsc(organizer).stream()
                .map(event -> toResponse(event, organizer))
                .collect(Collectors.toList());
    }

    public EventResponse getEvent(Long id, User currentUser) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        return toResponse(event, currentUser);
    }

    private EventResponse toResponse(Event event, User currentUser) {
        EventResponse response = new EventResponse();
        response.setId(event.getId());
        response.setName(event.getName());
        response.setDescription(event.getDescription());
        response.setAddress(event.getAddress());
        response.setCity(event.getCity());
        response.setCountry(event.getCountry());
        response.setPhone(event.getPhone());
        response.setPersonLimit(event.getPersonLimit());
        response.setTicketPrice(event.getTicketPrice());
        response.setCategory(event.getCategory());
        response.setDatestart(event.getStartDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        response.setDateend(event.getEndDate().atZone(ZoneId.systemDefault()).toEpochSecond());
        response.setOrganizerName(event.getOrganizer() != null ? event.getOrganizer().getName() : null);
        response.setOwnedByCurrentUser(currentUser != null && event.getOrganizer() != null && Objects.equals(event.getOrganizer().getId(), currentUser.getId()));
        return response;
    }
}

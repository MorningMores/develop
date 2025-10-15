package com.concert.controller;

import com.concert.dto.CreateEventRequest;
import com.concert.dto.EventResponse;
import com.concert.model.User;
import com.concert.repository.UserRepository;
import com.concert.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class EventControllerTest {

    private MockMvc mockMvc;

    @Mock
    private EventService eventService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private EventController eventController;

    private ObjectMapper objectMapper;
    private User testUser;
    private EventResponse eventResponse;
    private CreateEventRequest createEventRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(eventController).build();
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules();

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");

        eventResponse = new EventResponse();
        eventResponse.setId(1L);
        eventResponse.setTitle("Test Event");
        eventResponse.setDescription("Test Description");
        eventResponse.setCategory("Music");
        eventResponse.setLocation("Test Venue");

        createEventRequest = new CreateEventRequest();
        createEventRequest.setTitle("New Event");
        createEventRequest.setDescription("Event Description");
        createEventRequest.setCategory("Sports");
        createEventRequest.setLocation("Stadium");
        createEventRequest.setStartDate(LocalDateTime.now().plusDays(1));
        createEventRequest.setEndDate(LocalDateTime.now().plusDays(2));
        createEventRequest.setTicketPrice(50.0);
    }

    @Test
    void testCreateEvent_Success() throws Exception {
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.createEvent(any(User.class), any(CreateEventRequest.class)))
                .thenReturn(eventResponse);

        mockMvc.perform(post("/api/events")
                        .principal(authentication)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createEventRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Event"));

        verify(eventService, times(1)).createEvent(any(User.class), any(CreateEventRequest.class));
    }

    @Test
    void testCreateEvent_NoAuthentication() throws Exception {
        // Note: In real app, Spring Security would block this; here testing controller logic
        mockMvc.perform(post("/api/events")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createEventRequest)))
                .andExpect(status().is5xxServerError())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals("Authentication required", 
                           result.getResolvedException().getMessage()));
    }

    @Test
    void testCreateEvent_UserNotFound() throws Exception {
        when(authentication.getName()).thenReturn("unknown");
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(post("/api/events")
                        .principal(authentication)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createEventRequest)))
                .andExpect(status().is5xxServerError())
                .andExpect(result -> assertTrue(result.getResolvedException() instanceof IllegalArgumentException))
                .andExpect(result -> assertEquals("User not found", 
                           result.getResolvedException().getMessage()));
    }

    @Test
    void testListEvents_Success() throws Exception {
        EventResponse event2 = new EventResponse();
        event2.setId(2L);
        event2.setTitle("Event 2");

        List<EventResponse> eventList = Arrays.asList(eventResponse, event2);
        Page<EventResponse> eventPage = new PageImpl<>(eventList, PageRequest.of(0, 12), 2);

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.getUpcomingEvents(any(Pageable.class), any(User.class)))
                .thenReturn(eventPage);

        mockMvc.perform(get("/api/events")
                        .principal(authentication)
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[1].id").value(2));
    }

    @Test
    void testListEvents_NoAuthentication() throws Exception {
        List<EventResponse> eventList = Arrays.asList(eventResponse);
        Page<EventResponse> eventPage = new PageImpl<>(eventList);

        when(eventService.getUpcomingEvents(any(Pageable.class), eq(null)))
                .thenReturn(eventPage);

        mockMvc.perform(get("/api/events")
                        .param("page", "0")
                        .param("size", "12"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void testMyEvents_Success() throws Exception {
        List<EventResponse> events = Arrays.asList(eventResponse);

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.getEventsForOrganizer(testUser)).thenReturn(events);

        mockMvc.perform(get("/api/events/me")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1));

        verify(eventService, times(1)).getEventsForOrganizer(testUser);
    }

    @Test
    void testMyEvents_NoAuthentication() throws Exception {
        mockMvc.perform(get("/api/events/me"))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testGetEvent_Success() throws Exception {
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.getEvent(1L, testUser)).thenReturn(eventResponse);

        mockMvc.perform(get("/api/events/1")
                        .principal(authentication))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Test Event"));

        verify(eventService, times(1)).getEvent(1L, testUser);
    }

    @Test
    void testGetEvent_NoAuthentication() throws Exception {
        when(eventService.getEvent(eq(1L), eq(null))).thenReturn(eventResponse);

        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void testGetEvent_NotFound() throws Exception {
        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.getEvent(999L, testUser)).thenThrow(new IllegalArgumentException("Event not found"));

        mockMvc.perform(get("/api/events/999")
                        .principal(authentication))
                .andExpect(status().is5xxServerError());
    }

    @Test
    void testListEvents_WithCustomPagination() throws Exception {
        List<EventResponse> eventList = Arrays.asList(eventResponse);
        Page<EventResponse> eventPage = new PageImpl<>(eventList, PageRequest.of(1, 5), 10);

        when(authentication.getName()).thenReturn("testuser");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(eventService.getUpcomingEvents(any(Pageable.class), any(User.class)))
                .thenReturn(eventPage);

        mockMvc.perform(get("/api/events")
                        .principal(authentication)
                        .param("page", "1")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.number").value(1))
                .andExpect(jsonPath("$.size").value(5));
    }
}

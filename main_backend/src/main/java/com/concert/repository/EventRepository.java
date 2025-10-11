package com.concert.repository;

import com.concert.model.Event;
import com.concert.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    Page<Event> findAllByStartDateAfterOrderByStartDateAsc(LocalDateTime startDate, Pageable pageable);

    Page<Event> findAllByOrderByStartDateAsc(Pageable pageable);

    List<Event> findByOrganizerOrderByStartDateAsc(User organizer);

    Optional<Event> findByIdAndOrganizer(Long id, User organizer);
}

package com.bookstore.app.repository;

import com.bookstore.app.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findBySessionId(String sessionId);

    Optional<CartItem> findBySessionIdAndBookId(String sessionId, Long bookId);

    void deleteBySessionId(String sessionId);
}

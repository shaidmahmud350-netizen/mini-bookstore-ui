package com.bookstore.app.service;

import com.bookstore.app.entity.Book;
import com.bookstore.app.entity.CartItem;
import com.bookstore.app.repository.BookRepository;
import com.bookstore.app.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final BookRepository bookRepository;

    public List<CartItem> getCart(String sessionId) {
        return cartItemRepository.findBySessionId(sessionId);
    }

    @Transactional
    public CartItem addToCart(String sessionId, Long bookId, int quantity) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found: " + bookId));

        Optional<CartItem> existing = cartItemRepository.findBySessionIdAndBookId(sessionId, bookId);

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            CartItem item = CartItem.builder()
                    .book(book)
                    .quantity(quantity)
                    .sessionId(sessionId)
                    .build();
            return cartItemRepository.save(item);
        }
    }

    @Transactional
    public CartItem updateQuantity(Long cartItemId, int quantity) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found: " + cartItemId));
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return null;
        }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    @Transactional
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }
}

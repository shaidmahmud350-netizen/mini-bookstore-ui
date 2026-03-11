package com.bookstore.app.controller;

import com.bookstore.app.entity.CartItem;
import com.bookstore.app.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(
            @RequestHeader(value = "X-Session-Id", required = false, defaultValue = "default-session") String sessionId) {
        return ResponseEntity.ok(cartService.getCart(sessionId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @RequestHeader(value = "X-Session-Id", required = false, defaultValue = "default-session") String sessionId,
            @RequestBody Map<String, Object> body) {

        Long bookId = Long.valueOf(body.get("bookId").toString());
        int quantity = body.containsKey("quantity")
                ? Integer.parseInt(body.get("quantity").toString())
                : 1;

        CartItem item = cartService.addToCart(sessionId, bookId, quantity);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Object> body) {

        int quantity = Integer.parseInt(body.get("quantity").toString());
        CartItem item = cartService.updateQuantity(cartItemId, quantity);

        if (item == null) {
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }
        return ResponseEntity.ok(item);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Map<String, String>> removeFromCart(@PathVariable Long cartItemId) {
        cartService.removeFromCart(cartItemId);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, String>> clearCart(
            @RequestHeader(value = "X-Session-Id", required = false, defaultValue = "default-session") String sessionId) {
        cartService.clearCart(sessionId);
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}

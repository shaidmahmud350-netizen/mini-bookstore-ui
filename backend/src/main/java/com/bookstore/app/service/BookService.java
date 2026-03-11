package com.bookstore.app.service;

import com.bookstore.app.entity.Book;
import com.bookstore.app.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks(String keyword, String category, String sort) {
        List<Book> books;

        if (keyword != null && !keyword.isBlank()) {
            books = bookRepository.searchBooks(keyword.trim(),
                    (category != null && !category.isBlank()) ? category.trim() : null);
        } else if (category != null && !category.isBlank()) {
            books = bookRepository.findByCategoryIgnoreCase(category.trim());
        } else {
            books = bookRepository.findAll();
        }

        if (sort != null) {
            switch (sort) {
                case "price_asc"  -> books.sort(Comparator.comparingDouble(Book::getPrice));
                case "price_desc" -> books.sort(Comparator.comparingDouble(Book::getPrice).reversed());
                case "title_asc"  -> books.sort(Comparator.comparing(Book::getTitle));
                case "title_desc" -> books.sort(Comparator.comparing(Book::getTitle).reversed());
                case "rating"     -> books.sort(Comparator.comparingDouble(
                        b -> (b.getRating() == null ? 0 : -b.getRating())));
            }
        }

        return books;
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public List<String> getAllCategories() {
        return bookRepository.findAll()
                .stream()
                .map(Book::getCategory)
                .distinct()
                .sorted()
                .toList();
    }
}

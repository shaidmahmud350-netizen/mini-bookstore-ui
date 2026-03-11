package com.bookstore.app;

import com.bookstore.app.entity.Book;
import com.bookstore.app.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Override
    public void run(String... args) {
        if (bookRepository.count() == 0) {
            bookRepository.saveAll(List.of(
                Book.builder()
                    .title("The Great Gatsby")
                    .author("F. Scott Fitzgerald")
                    .description("A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, set in the Jazz Age of the 1920s. A timeless novel about the American Dream, excess, and the hollowness of the upper class.")
                    .price(15.00).originalPrice(20.00).discountPercent(25)
                    .category("Classic Literature").stock(50)
                    .rating(4.5).reviewCount(1240).coverColor("#8B7355")
                    .build(),
                Book.builder()
                    .title("Atomic Habits")
                    .author("James Clear")
                    .description("An easy and proven way to build good habits and break bad ones. This book reveals how tiny changes in behavior can lead to remarkable results, offering a practical framework for self-improvement.")
                    .price(20.00).originalPrice(27.00).discountPercent(26)
                    .category("Self-Help").stock(80)
                    .rating(4.8).reviewCount(3560).coverColor("#2E86AB")
                    .build(),
                Book.builder()
                    .title("Clean Code")
                    .author("Robert C. Martin")
                    .description("A handbook of agile software craftsmanship. This book is packed with dozens of code examples and reveals the best practices of writing clean, readable, maintainable code that stands the test of time.")
                    .price(35.00).originalPrice(45.00).discountPercent(22)
                    .category("Programming").stock(30)
                    .rating(4.7).reviewCount(2100).coverColor("#1A1A2E")
                    .build(),
                Book.builder()
                    .title("To Kill a Mockingbird")
                    .author("Harper Lee")
                    .description("Pulitzer Prize–winning masterwork of honor and injustice in the deep South—and the heroism of one man in the face of blind and violent hatred, told through the eyes of a young girl named Scout Finch.")
                    .price(13.50).originalPrice(18.00).discountPercent(25)
                    .category("Classic Literature").stock(45)
                    .rating(4.9).reviewCount(4200).coverColor("#5C4033")
                    .build(),
                Book.builder()
                    .title("The Alchemist")
                    .author("Paulo Coelho")
                    .description("A magical fable about following your dreams. A young Andalusian shepherd discovers that his destiny lies far beyond his homeland, and embarks on an extraordinary journey filled with beauty and wisdom.")
                    .price(12.99).originalPrice(16.00).discountPercent(19)
                    .category("Fiction").stock(70)
                    .rating(4.6).reviewCount(5100).coverColor("#D4A017")
                    .build(),
                Book.builder()
                    .title("Dune")
                    .author("Frank Herbert")
                    .description("Set in the distant future, Dune tells the story of young Paul Atreides as he navigates the politically charged desert world of Arrakis, home to the most valuable substance in the universe.")
                    .price(18.00).originalPrice(24.00).discountPercent(25)
                    .category("Science Fiction").stock(55)
                    .rating(4.8).reviewCount(3800).coverColor("#C27A27")
                    .build(),
                Book.builder()
                    .title("Harry Potter and the Philosopher's Stone")
                    .author("J.K. Rowling")
                    .description("The magical story of a boy who discovers he is a wizard, attends Hogwarts School of Witchcraft and Wizardry, and must confront the dark wizard who killed his parents. The beginning of a legendary series.")
                    .price(16.00).originalPrice(20.00).discountPercent(20)
                    .category("Fantasy").stock(100)
                    .rating(4.9).reviewCount(9800).coverColor("#7B2D8B")
                    .build(),
                Book.builder()
                    .title("Sapiens")
                    .author("Yuval Noah Harari")
                    .description("A brief history of humankind, from the Stone Age to the twenty-first century. Harari explores how biology and history have defined us and enhanced — or limited — our possibilities.")
                    .price(22.00).originalPrice(30.00).discountPercent(27)
                    .category("Non-Fiction").stock(60)
                    .rating(4.7).reviewCount(4500).coverColor("#3A7D44")
                    .build(),
                Book.builder()
                    .title("The Pragmatic Programmer")
                    .author("David Thomas & Andrew Hunt")
                    .description("From journeyman to master—this book examines the core process of software development, offering guidance on DRY principles, orthogonality, tracer bullets, metaprogramming, and career development for developers.")
                    .price(40.00).originalPrice(50.00).discountPercent(20)
                    .category("Programming").stock(25)
                    .rating(4.6).reviewCount(1800).coverColor("#2C3E50")
                    .build(),
                Book.builder()
                    .title("The Subtle Art of Not Giving a F*ck")
                    .author("Mark Manson")
                    .description("A counterintuitive approach to living a good life. Manson argues that improving our lives hinges not on our positivity but on whether we're doing what we consider important and what is real and substantive.")
                    .price(14.99).originalPrice(19.99).discountPercent(25)
                    .category("Self-Help").stock(90)
                    .rating(4.4).reviewCount(6700).coverColor("#E74C3C")
                    .build(),
                Book.builder()
                    .title("1984")
                    .author("George Orwell")
                    .description("A dystopian social science fiction novel about mass surveillance, totalitarian government, and the suppression of free thought. One of the most influential novels of the 20th century.")
                    .price(11.25).originalPrice(15.00).discountPercent(25)
                    .category("Classic Literature").stock(65)
                    .rating(4.8).reviewCount(7300).coverColor("#B7950B")
                    .build(),
                Book.builder()
                    .title("Design Patterns")
                    .author("Gang of Four")
                    .description("Elements of Reusable Object-Oriented Software. This landmark book captures decades of design experience as design patterns and describes how to represent them as elements of object-oriented design.")
                    .price(45.00).originalPrice(55.00).discountPercent(18)
                    .category("Programming").stock(20)
                    .rating(4.5).reviewCount(2300).coverColor("#154360")
                    .build()
            ));
        }
    }
}

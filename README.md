# 📚 Mini Online Bookstore

A full-stack Mini Online Bookstore with a Spring Boot REST API backend and a pure HTML/CSS/Vanilla JS + jQuery frontend.

---

## 🏗 Project Structure

```
bookstore-app/
├── backend/          ← Spring Boot application (Maven)
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/bookstore/app/
│           │   ├── BookstoreAppApplication.java
│           │   ├── DataSeeder.java          ← Seeds 12 sample books
│           │   ├── entity/                  ← Book.java, CartItem.java
│           │   ├── repository/              ← JPA repositories
│           │   ├── service/                 ← BookService, CartService
│           │   ├── controller/              ← BookController, CartController
│           │   └── config/                  ← CorsConfig
│           └── resources/
│               └── application.properties
│
└── frontend/         ← Static HTML/CSS/JS files
    ├── index.html        ← Book listing page
    ├── book-detail.html  ← Book detail page
    ├── cart.html         ← Shopping cart page
    ├── css/
    │   └── styles.css
    └── js/
        ├── api.js         ← All AJAX API calls
        ├── utils.js       ← Toast, spinner, formatting
        ├── books.js       ← Book listing logic
        ├── book-detail.js ← Detail page logic
        └── cart.js        ← Cart page logic
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 17+** ([download](https://adoptium.net/))
- **Maven 3.8+** ([download](https://maven.apache.org/download.cgi)) or use Maven Wrapper

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API will be available at: **http://localhost:8080**

> **Note**: Using H2 in-memory DB — no database installation needed! Books are seeded automatically on startup.

### 2. Open the Frontend

**Option A – Direct file open (simplest):**
- Open `frontend/index.html` directly in your browser

**Option B – Live Server (recommended for development):**
- Install [Live Server VS Code extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Right-click `frontend/index.html` → "Open with Live Server"

**Option C – Python HTTP Server:**
```bash
cd frontend
python -m http.server 5500
```
Then open http://localhost:5500

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/books` | List all books |
| `GET` | `/api/books?keyword=java` | Search by title or author |
| `GET` | `/api/books?category=Programming` | Filter by category |
| `GET` | `/api/books?sort=price_asc` | Sort: `price_asc`, `price_desc`, `title_asc`, `title_desc`, `rating` |
| `GET` | `/api/books/{id}` | Get book by ID |
| `GET` | `/api/books/categories` | List all categories |
| `GET` | `/api/cart` | Get cart (uses `X-Session-Id` header) |
| `POST` | `/api/cart/add` | Add book to cart `{ bookId, quantity }` |
| `PUT` | `/api/cart/update/{id}` | Update cart item quantity `{ quantity }` |
| `DELETE` | `/api/cart/remove/{id}` | Remove cart item |
| `DELETE` | `/api/cart/clear` | Clear entire cart |

### H2 Console (Debug)
- URL: http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:bookstoredb`
- Username: `sa`, Password: *(empty)*

---

## ✨ Features

### Frontend
- 📚 **Book Grid** – 12 sample books across 6 categories
- 🔍 **Live Search** – Debounced search by title or author via API
- 🏷 **Category Filter** – Filter chips loaded dynamically from API
- ↕ **Sorting** – By price, title A-Z, top rated
- 📄 **Pagination** – Navigate through multiple pages
- 📖 **Book Detail** – Full info with star ratings, discount badge, quantity selector
- 🛒 **Shopping Cart** – Add/remove/update quantities, order summary with tax
- 💳 **Promo Code** – Try `SAVE10`
- ⏳ **Loading Spinner** – Shows during API calls
- 🔔 **Toast Notifications** – Success/error/info feedback
- 💀 **Skeleton Loaders** – While data loads

### Backend
- Rest API with Spring Boot 3
- H2 in-memory database (zero configuration)
- Session-based cart (localStorage UUID → `X-Session-Id` header)
- CORS enabled for all origins

---

## 🎨 Design

Matches the Figma design with:
- Dark Navy (#1a1f6e) primary color
- Orange (#ff6b1a) accent/CTA
- Inter font (Google Fonts)
- Card hover animations
- Fully responsive (Desktop → Mobile)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS, jQuery 3.7 |
| Backend | Java 17, Spring Boot 3.2, Spring Web, Spring Data JPA |
| Database | H2 (in-memory) |
| Build | Maven |

---

## 📦 Bonus Features Implemented

- ✅ Loading spinner while API loads
- ✅ Toast notifications
- ✅ Pagination
- ✅ Sorting books
- ✅ Category filtering
- ✅ Skeleton loaders
- ✅ Promo code field
- ✅ Star ratings

---

*Submitted – March 2026*

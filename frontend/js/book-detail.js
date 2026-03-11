/**
 * book-detail.js – Book Detail Page logic
 * Reads `id` from URL params, loads book via API, handles qty and add-to-cart
 */

const BookDetailPage = (() => {

  let bookData = null;
  let quantity = 1;

  function getBookIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function renderBook(book) {
    bookData = book;
    const coverBg = Utils.bookCoverBg(book);
    const discountBadge = book.discountPercent
      ? `<span class="badge badge-accent">${book.discountPercent}% OFF</span>` : '';
    const origPrice = book.originalPrice
      ? `<span class="detail-price-orig">${Utils.formatPrice(book.originalPrice)}</span>` : '';
    const stockStatus = book.stock > 0
      ? `<span class="badge badge-success">✓ In Stock (${book.stock} left)</span>`
      : `<span class="badge" style="background:#fde8e8;color:var(--danger)">Out of Stock</span>`;

    // Update breadcrumb
    $('#breadcrumb-category').text(book.category);
    $('#breadcrumb-title').text(book.title);

    // Set page title
    document.title = `${book.title} – BookStore`;

    // Render detail layout
    $('#detail-cover').css('background', coverBg);
    $('#detail-title').text(book.title);
    $('#detail-author').text('by ' + book.author);
    $('#detail-stars').html(Utils.renderStars(book.rating || 4));
    $('#detail-review-count').text(`(${(book.reviewCount || 0).toLocaleString()} Reviews)`);
    $('#detail-price').text(Utils.formatPrice(book.price));
    $('#detail-price-orig').html(origPrice);
    $('#detail-discount').html(discountBadge);
    $('#detail-stock').html(stockStatus);
    $('#detail-category').text(book.category);
    $('#detail-description').text(book.description || 'No description available.');

    if (book.stock === 0) {
      $('#add-cart-btn').prop('disabled', true).text('Out of Stock');
    }
  }

  function updateQtyDisplay() {
    $('#qty-val').text(quantity);
  }

  function initQtyControls() {
    $('#qty-minus').on('click', () => {
      if (quantity > 1) { quantity--; updateQtyDisplay(); }
    });
    $('#qty-plus').on('click', () => {
      if (bookData && quantity < bookData.stock) {
        quantity++;
        updateQtyDisplay();
      } else if (!bookData) {
        quantity++;
        updateQtyDisplay();
      }
    });
  }

  function initAddToCart() {
    $('#add-cart-btn').on('click', function () {
      if (!bookData) return;
      const $btn = $(this);
      $btn.prop('disabled', true).html('⏳ Adding…');

      Api.addToCart(bookData.id, quantity)
        .then(() => {
          Utils.showToast(`"${bookData.title}" added to cart! 🛒`, 'success');
          Utils.refreshCartBadge();
          $btn.html('✅ Added!');
          setTimeout(() => {
            $btn.prop('disabled', false).html('🛒 ADD TO CART');
          }, 2000);
        })
        .catch(() => {
          Utils.showToast('Failed to add to cart', 'error');
          $btn.prop('disabled', false).html('🛒 ADD TO CART');
        });
    });

    $('#wishlist-btn').on('click', function () {
      Utils.showToast('Added to wishlist! ❤️', 'info');
      $(this).html('❤️ Added to Wishlist');
    });
  }

  function initBackButton() {
    $('#back-link').on('click', function () {
      window.location.href = 'index.html';
    });
  }

  function loadBook(id) {
    Utils.showSpinner();
    Api.getBookById(id)
      .then(book => {
        renderBook(book);
      })
      .catch(err => {
        console.error(err);
        Utils.showToast('Book not found or backend is offline', 'error');
        $('#detail-content').html(`
          <div class="no-results" style="grid-column:1/-1">
            <div class="icon">📚</div>
            <h3>Book not found</h3>
            <p>The book you're looking for doesn't exist or the server is offline.</p>
            <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top:16px">← Back to Books</button>
          </div>`);
      })
      .always(() => Utils.hideSpinner());
  }

  function init() {
    const id = getBookIdFromUrl();
    if (!id) {
      window.location.href = 'index.html';
      return;
    }
    initQtyControls();
    initAddToCart();
    initBackButton();
    loadBook(id);
    Utils.refreshCartBadge();
  }

  return { init };
})();

$(document).ready(() => BookDetailPage.init());

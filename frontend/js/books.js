/**
 * books.js – Book Listing Page logic
 * Handles loading books, search (debounced), category filter, sort, pagination
 */

const BooksPage = (() => {

  const PAGE_SIZE = 12;
  let allBooks = [];
  let filteredBooks = [];
  let currentPage = 1;
  let currentCategory = '';
  let currentSort = '';
  let currentKeyword = '';
  let searchTimer = null;

  /* ---- Render Helpers ---- */
  function renderBookCard(book) {
    const coverBg = Utils.bookCoverBg(book);
    const discountBadge = book.discountPercent
      ? `<span class="book-discount-badge">${book.discountPercent}% OFF</span>` : '';
    const origPrice = book.originalPrice
      ? `<span class="price-original">${Utils.formatPrice(book.originalPrice)}</span>` : '';

    return `
      <div class="book-card" data-id="${book.id}">
        <div class="book-cover" style="background:${coverBg}">
          <div class="book-cover-inner">
            <span class="book-cover-icon">📖</span>
          </div>
          ${discountBadge}
        </div>
        <div class="book-info">
          <div class="book-category">${book.category}</div>
          <div class="book-title">${book.title}</div>
          <div class="book-author">${book.author}</div>
          <div class="book-rating">
            ${Utils.renderStars(book.rating || 4)}
            <span class="review-count">(${(book.reviewCount || 0).toLocaleString()})</span>
          </div>
          <div class="book-footer">
            <div class="price-row">
              <span class="price-main">${Utils.formatPrice(book.price)}</span>
              ${origPrice}
            </div>
            <div class="book-actions">
              <button class="btn btn-outline view-btn" data-id="${book.id}">View Details</button>
              <button class="btn-cart-icon add-cart-btn" data-id="${book.id}" title="Add to Cart">🛒</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderSkeletons(count) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="book-card">
          <div class="skeleton" style="height:220px;border-radius:var(--radius-lg) var(--radius-lg) 0 0"></div>
          <div class="book-info" style="gap:10px;display:flex;flex-direction:column">
            <div class="skeleton" style="height:12px;width:50%;border-radius:4px"></div>
            <div class="skeleton" style="height:18px;width:90%;border-radius:4px"></div>
            <div class="skeleton" style="height:14px;width:60%;border-radius:4px"></div>
            <div class="skeleton" style="height:14px;width:70%;border-radius:4px;margin-top:4px"></div>
            <div class="skeleton" style="height:36px;border-radius:var(--radius-sm);margin-top:8px"></div>
          </div>
        </div>`;
    }
    return html;
  }

  function renderPagination(total, page, pageSize) {
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) { $('#pagination').empty(); return; }

    let html = `<button class="page-btn" id="prev-page" ${page === 1 ? 'disabled' : ''}>&#8249;</button>`;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        html += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
      } else if (i === page - 2 || i === page + 2) {
        html += `<span class="page-btn" style="cursor:default;border:none">…</span>`;
      }
    }

    html += `<button class="page-btn" id="next-page" ${page === totalPages ? 'disabled' : ''}>&#8250;</button>`;
    $('#pagination').html(html);
  }

  function renderPage() {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageBooks = filteredBooks.slice(start, end);

    if (filteredBooks.length === 0) {
      $('#books-grid').html(`
        <div class="no-results">
          <div class="icon">🔍</div>
          <h3>No books found</h3>
          <p>Try a different search term or category</p>
        </div>`);
      $('#pagination').empty();
      $('#results-count').text('0 books found');
      return;
    }

    $('#books-grid').html(pageBooks.map(renderBookCard).join(''));
    renderPagination(filteredBooks.length, currentPage, PAGE_SIZE);
    $('#results-count').text(`${filteredBooks.length} book${filteredBooks.length !== 1 ? 's' : ''} found`);
    bindCardEvents();
  }

  /* ---- Apply filters locally (for sort/category once data is loaded) ---- */
  function applyFilters() {
    currentPage = 1;
    loadBooks();
  }

  function sortBooks(books) {
    const sorted = [...books];
    switch (currentSort) {
      case 'price_asc': sorted.sort((a, b) => a.price - b.price); break;
      case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
      case 'title_asc': sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'title_desc': sorted.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'rating': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    }
    return sorted;
  }

  /* ---- API call ---- */
  function loadBooks() {
    $('#books-grid').html(renderSkeletons(8));
    Utils.showSpinner();

    const params = {};
    if (currentKeyword) params.keyword = currentKeyword;
    if (currentCategory) params.category = currentCategory;
    if (currentSort) params.sort = currentSort;

    Api.getBooks(params)
      .then(books => {
        filteredBooks = books;
        renderPage();
      })
      .catch(err => {
        console.error(err);
        Utils.showToast('Failed to load books. Is the backend running?', 'error');
        $('#books-grid').html('<div class="no-results"><div class="icon">⚠️</div><h3>Could not load books</h3><p>Please make sure the backend is running on port 8080</p></div>');
      })
      .always(() => Utils.hideSpinner());
  }

  function loadCategories() {
    Api.getCategories()
      .then(cats => {
        let html = '<button class="chip active" data-cat="">All</button>';
        html += cats.map(c => `<button class="chip" data-cat="${c}">${c}</button>`).join('');
        $('#category-chips').html(html);
        bindChipEvents();
      })
      .catch(() => {});
  }

  /* ---- Event Binding ---- */
  function bindCardEvents() {
    $('.view-btn').on('click', function () {
      const id = $(this).data('id');
      window.location.href = `book-detail.html?id=${id}`;
    });

    $('.add-cart-btn').on('click', function () {
      const id = $(this).data('id');
      const $btn = $(this);
      $btn.prop('disabled', true).text('⏳');
      Api.addToCart(id, 1)
        .then(() => {
          Utils.showToast('Added to cart! 🛒', 'success');
          Utils.refreshCartBadge();
          $btn.text('✅');
          setTimeout(() => { $btn.prop('disabled', false).text('🛒'); }, 1500);
        })
        .catch(() => {
          Utils.showToast('Failed to add to cart. Backend running?', 'error');
          $btn.prop('disabled', false).text('🛒');
        });
    });
  }

  function bindChipEvents() {
    $('#category-chips').on('click', '.chip', function () {
      currentCategory = $(this).data('cat');
      $('.chip').removeClass('active');
      $(this).addClass('active');
      applyFilters();
    });
  }

  /* ---- Search ---- */
  function initSearch() {
    // Hero search
    $('#hero-search-input').on('input', function () {
      const val = $(this).val();
      $('#nav-search-input').val(val);
      triggerSearch(val);
    });

    $('#hero-search-btn').on('click', function () {
      const val = $('#hero-search-input').val();
      triggerSearch(val);
    });

    // Navbar search
    $('#nav-search-input').on('input', function () {
      const val = $(this).val();
      $('#hero-search-input').val(val);
      triggerSearch(val);
    });

    function triggerSearch(val) {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        currentKeyword = val.trim();
        applyFilters();
      }, 300);
    }
  }

  /* ---- Pagination ---- */
  function initPagination() {
    $('#pagination').on('click', '.page-btn[data-page]', function () {
      currentPage = parseInt($(this).data('page'));
      renderPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    $('#pagination').on('click', '#prev-page', function () {
      if (currentPage > 1) { currentPage--; renderPage(); }
    });
    $('#pagination').on('click', '#next-page', function () {
      const totalPages = Math.ceil(filteredBooks.length / PAGE_SIZE);
      if (currentPage < totalPages) { currentPage++; renderPage(); }
    });
  }

  /* ---- Sort ---- */
  function initSort() {
    $('#sort-select').on('change', function () {
      currentSort = $(this).val();
      applyFilters();
    });
  }

  /* ---- Init ---- */
  function init() {
    loadCategories();
    loadBooks();
    initSearch();
    initPagination();
    initSort();
    Utils.refreshCartBadge();
  }

  return { init };
})();

$(document).ready(() => BooksPage.init());

/**
 * api.js – Central AJAX module for all API calls
 * All requests go through this module using jQuery $.ajax
 */

// In production, set window.API_BASE_URL to your deployed backend URL.
// e.g. <script>window.API_BASE_URL = 'https://your-app.onrender.com/api';</script>
const API_BASE = (typeof window !== 'undefined' && window.API_BASE_URL)
  ? window.API_BASE_URL
  : 'http://localhost:8080/api';

const Api = (() => {

  function getSessionId() {
    let sid = localStorage.getItem('bs_session_id');
    if (!sid) {
      sid = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('bs_session_id', sid);
    }
    return sid;
  }

  function defaultHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-Session-Id': getSessionId()
    };
  }

  /**
   * GET /api/books
   * @param {Object} params - { keyword, category, sort }
   */
  function getBooks(params = {}) {
    return $.ajax({
      url: API_BASE + '/books',
      method: 'GET',
      data: params,
      headers: defaultHeaders()
    });
  }

  /**
   * GET /api/books/:id
   */
  function getBookById(id) {
    return $.ajax({
      url: API_BASE + '/books/' + id,
      method: 'GET',
      headers: defaultHeaders()
    });
  }

  /**
   * GET /api/books/categories
   */
  function getCategories() {
    return $.ajax({
      url: API_BASE + '/books/categories',
      method: 'GET',
      headers: defaultHeaders()
    });
  }

  /**
   * GET /api/cart
   */
  function getCart() {
    return $.ajax({
      url: API_BASE + '/cart',
      method: 'GET',
      headers: defaultHeaders()
    });
  }

  /**
   * POST /api/cart/add
   * @param {number} bookId
   * @param {number} quantity
   */
  function addToCart(bookId, quantity = 1) {
    return $.ajax({
      url: API_BASE + '/cart/add',
      method: 'POST',
      contentType: 'application/json',
      headers: defaultHeaders(),
      data: JSON.stringify({ bookId, quantity })
    });
  }

  /**
   * PUT /api/cart/update/:cartItemId
   * @param {number} cartItemId
   * @param {number} quantity
   */
  function updateCartItem(cartItemId, quantity) {
    return $.ajax({
      url: API_BASE + '/cart/update/' + cartItemId,
      method: 'PUT',
      contentType: 'application/json',
      headers: defaultHeaders(),
      data: JSON.stringify({ quantity })
    });
  }

  /**
   * DELETE /api/cart/remove/:cartItemId
   */
  function removeFromCart(cartItemId) {
    return $.ajax({
      url: API_BASE + '/cart/remove/' + cartItemId,
      method: 'DELETE',
      headers: defaultHeaders()
    });
  }

  return {
    getSessionId,
    getBooks,
    getBookById,
    getCategories,
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart
  };
})();

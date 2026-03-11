/**
 * utils.js – Shared utilities: spinner, toast, formatting, stars
 */

const Utils = (() => {

  /* ---- Loading Spinner ---- */
  function showSpinner() {
    $('#loading-overlay').removeClass('hidden');
  }

  function hideSpinner() {
    $('#loading-overlay').addClass('hidden');
  }

  /* ---- Toast Notifications ---- */
  const TOAST_DURATION = 3500;

  function showToast(message, type = 'success') {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    const $toast = $('<div class="toast"></div>').addClass(type);
    $toast.html(`
      <span class="toast-icon">${icons[type] || '✅'}</span>
      <span class="toast-msg">${message}</span>
    `);

    $('#toast-container').append($toast);

    setTimeout(() => {
      $toast.addClass('removing');
      setTimeout(() => $toast.remove(), 300);
    }, TOAST_DURATION);
  }

  /* ---- Price Formatting ---- */
  function formatPrice(amount) {
    if (amount == null) return '$0.00';
    return '$' + parseFloat(amount).toFixed(2);
  }

  /* ---- Star Rating ---- */
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    let stars = '★'.repeat(full);
    if (half) stars += '½';
    stars += '☆'.repeat(empty);
    return `<span class="stars">${stars}</span>`;
  }

  /* ---- Cart Count Badge ---- */
  function updateCartBadge(count) {
    if (count > 0) {
      $('.cart-badge').text(count).removeClass('hidden');
    } else {
      $('.cart-badge').text(0).addClass('hidden');
    }
  }

  function refreshCartBadge() {
    Api.getCart()
      .then(items => {
        const total = (items || []).reduce((sum, i) => sum + i.quantity, 0);
        updateCartBadge(total);
      })
      .catch(() => {});
  }

  /* ---- Cover Color ---- */
  function bookCoverBg(book) {
    return book.coverColor || '#1a1f6e';
  }

  /* ---- Truncate ---- */
  function truncate(str, len = 80) {
    if (!str) return '';
    return str.length > len ? str.slice(0, len) + '…' : str;
  }

  return {
    showSpinner,
    hideSpinner,
    showToast,
    formatPrice,
    renderStars,
    updateCartBadge,
    refreshCartBadge,
    bookCoverBg,
    truncate
  };
})();

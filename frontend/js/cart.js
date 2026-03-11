/**
 * cart.js – Shopping Cart Page logic
 * Load cart items, render, update qty, remove, compute totals
 */

const CartPage = (() => {

  let cartItems = [];

  /* ---- Render ---- */
  function renderCartItem(item) {
    const book = item.book;
    const subtotal = book.price * item.quantity;
    const coverBg = Utils.bookCoverBg(book);

    return `
      <div class="cart-item" data-cart-id="${item.id}">
        <div class="cart-item-cover" style="background:${coverBg}; border-radius:8px">
          📖
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${book.title}</div>
          <div class="cart-item-author">${book.author}</div>
          <div class="cart-item-controls">
            <div class="qty-small">
              <button class="qty-dec" data-cart-id="${item.id}" data-qty="${item.quantity}">−</button>
              <span class="qty-num">${item.quantity}</span>
              <button class="qty-inc" data-cart-id="${item.id}" data-qty="${item.quantity}">+</button>
            </div>
            <span class="unit-price">x ${Utils.formatPrice(book.price)}</span>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between">
          <button class="remove-btn" data-cart-id="${item.id}" title="Remove">🗑️</button>
          <span class="item-subtotal">${Utils.formatPrice(subtotal)}</span>
        </div>
      </div>`;
  }

  function renderSummary() {
    const subtotal = cartItems.reduce((sum, i) => sum + i.book.price * i.quantity, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    $('#summary-subtotal').text(Utils.formatPrice(subtotal));
    $('#summary-tax').text(Utils.formatPrice(tax));
    $('#summary-total').text(Utils.formatPrice(total));

    const count = cartItems.reduce((sum, i) => sum + i.quantity, 0);
    $('#cart-count-text').text(`You have ${count} item${count !== 1 ? 's' : ''} in your cart`);
    Utils.updateCartBadge(count);
  }

  function renderCart() {
    if (cartItems.length === 0) {
      $('#cart-items-list').html(`
        <div class="empty-cart">
          <div class="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any books yet.</p>
          <button class="btn btn-primary" onclick="window.location.href='index.html'">
            ← Browse Books
          </button>
        </div>`);
      renderSummary();
      return;
    }

    $('#cart-items-list').html(cartItems.map(renderCartItem).join(''));
    renderSummary();
    bindCartEvents();
  }

  /* ---- Event Binding ---- */
  function bindCartEvents() {
    // Decrease by one
    $('.qty-dec').on('click', function () {
      const cartId = $(this).data('cart-id');
      const qty = parseInt($(this).data('qty'));
      if (qty <= 1) {
        removeItem(cartId);
      } else {
        updateItem(cartId, qty - 1);
      }
    });

    // Increase by one
    $('.qty-inc').on('click', function () {
      const cartId = $(this).data('cart-id');
      const qty = parseInt($(this).data('qty'));
      updateItem(cartId, qty + 1);
    });

    // Remove item
    $('.remove-btn').on('click', function () {
      const cartId = $(this).data('cart-id');
      removeItem(cartId);
    });
  }

  function updateItem(cartId, newQty) {
    Utils.showSpinner();
    Api.updateCartItem(cartId, newQty)
      .then(result => {
        if (!result || result.message) {
          cartItems = cartItems.filter(i => i.id !== cartId);
        } else {
          const idx = cartItems.findIndex(i => i.id === cartId);
          if (idx !== -1) cartItems[idx].quantity = newQty;
        }
        renderCart();
        Utils.showToast('Cart updated', 'success');
      })
      .catch(() => Utils.showToast('Failed to update cart', 'error'))
      .always(() => Utils.hideSpinner());
  }

  function removeItem(cartId) {
    Utils.showSpinner();
    Api.removeFromCart(cartId)
      .then(() => {
        cartItems = cartItems.filter(i => i.id !== cartId);
        renderCart();
        Utils.showToast('Item removed from cart', 'info');
      })
      .catch(() => Utils.showToast('Failed to remove item', 'error'))
      .always(() => Utils.hideSpinner());
  }

  function loadCart() {
    Utils.showSpinner();
    // Show skeleton placeholders
    $('#cart-items-list').html(`
      <div style="display:flex;flex-direction:column;gap:12px">
        ${[1,2].map(() => `
          <div class="cart-item">
            <div class="skeleton" style="width:70px;height:95px;border-radius:6px;flex-shrink:0"></div>
            <div style="flex:1;display:flex;flex-direction:column;gap:8px">
              <div class="skeleton" style="height:16px;width:60%"></div>
              <div class="skeleton" style="height:12px;width:40%"></div>
              <div class="skeleton" style="height:32px;width:50%;margin-top:8px"></div>
            </div>
          </div>`).join('')}
      </div>`);

    Api.getCart()
      .then(items => {
        cartItems = items;
        renderCart();
      })
      .catch(err => {
        console.error(err);
        Utils.showToast('Failed to load cart. Is the backend running?', 'error');
        $('#cart-items-list').html(`
          <div class="empty-cart">
            <div class="icon">⚠️</div>
            <h2>Could not load cart</h2>
            <p>Please make sure the backend is running on <strong>localhost:8080</strong></p>
          </div>`);
      })
      .always(() => Utils.hideSpinner());
  }

  function initCheckout() {
    $('#checkout-btn').on('click', function () {
      if (cartItems.length === 0) {
        Utils.showToast('Your cart is empty!', 'warning');
        return;
      }
      Utils.showToast('Order placed successfully! 🎉 (Demo)', 'success');
    });

    $('#promo-apply-btn').on('click', function () {
      const code = $('#promo-input').val().trim().toUpperCase();
      if (code === 'SAVE10') {
        Utils.showToast('Promo code SAVE10 applied! 10% off 🎁', 'success');
      } else if (code) {
        Utils.showToast('Invalid promo code', 'error');
      }
    });

    $('#continue-shopping').on('click', function () {
      window.location.href = 'index.html';
    });
  }

  function init() {
    loadCart();
    initCheckout();
  }

  return { init };
})();

$(document).ready(() => CartPage.init());

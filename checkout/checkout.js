document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage (shared with menu site)
  let cart = [];
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }

  const orderItems = document.querySelector('.order-items');
  const totalAmount = document.querySelector('.total-amount');

  // Render cart items
  function renderCart() {
    orderItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(2)}</span>`;
      orderItems.appendChild(li);
      total += item.price;
    });
    totalAmount.textContent = `$${total.toFixed(2)}`;
  }

  renderCart();

  // Handle form submission
  const form = document.querySelector('.checkout-form');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    // Simple validation
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const firstName = form['first-name'].value.trim();
    const lastName = form['last-name'].value.trim();
    const cardNumber = form['card-number'].value.trim();
    const expiry = form.expiry.value.trim();
    const cvv = form.cvv.value.trim();
    if (!phone || !email || !firstName || !lastName || !cardNumber || !expiry || !cvv) {
      alert('Please fill in all fields.');
      return;
    }
    // Simulate order placement
    alert('Order placed! Thank you for ordering with Noodles & More.');
    // Optionally clear cart
    localStorage.removeItem('cart');
    window.location.href = '../Takeaway2/takeaway2.html';
  });
}); 
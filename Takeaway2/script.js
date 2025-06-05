document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let cart = [];
    const orderItems = document.querySelector('.order-items');
    const totalAmount = document.querySelector('.total-amount');
    const orderSummary = document.querySelector('.order-summary');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartCount = document.querySelector('.cart-count');

    // Toggle cart panel
    cartToggle.addEventListener('click', function() {
        orderSummary.classList.toggle('active');
    });

    // Close cart panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!orderSummary.contains(e.target)) {
            orderSummary.classList.remove('active');
        }
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            // Add item to cart
            cart.push({ name, price });
            
            // Update cart display
            updateCartDisplay();
            
            // Show feedback
            this.textContent = 'Added!';
            setTimeout(() => {
                this.textContent = 'Add to Cart';
            }, 1000);

            // Show cart panel
            orderSummary.classList.add('active');
        });
    });

    // Remove item functionality
    orderItems.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
        }
    });

    // Update cart display
    function updateCartDisplay() {
        // Clear current display
        orderItems.innerHTML = '';
        
        // Update cart count
        cartCount.textContent = cart.length;
        
        // Add each item
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name}</span>
                <div class="item-actions">
                    <span>$${item.price.toFixed(2)}</span>
                    <button class="remove-item" data-index="${index}">×</button>
                </div>
            `;
            orderItems.appendChild(li);
        });

        // Update total
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;

        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Load cart from localStorage on page load
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}); 
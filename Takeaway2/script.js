document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let cart = [];
    const orderItems = document.querySelector('.order-items');
    const totalAmount = document.querySelector('.total-amount');
    const orderSummary = document.querySelector('.order-summary');
    const cartToggle = document.querySelector('.cart-toggle');
    const cartCount = document.querySelector('.cart-count');
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.querySelector('.search-results');
    const menuItems = document.querySelectorAll('.menu-item');
    const orderContent = document.querySelector('.order-content');

    // Add minimize button to cart header
    const orderHeader = document.querySelector('.order-header');
    const minimizeButton = document.createElement('button');
    minimizeButton.className = 'minimize-cart';
    minimizeButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
    minimizeButton.setAttribute('aria-label', 'Minimize cart');
    orderHeader.appendChild(minimizeButton);

    // Search functionality
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        // Clear previous results
        searchResults.innerHTML = '';
        
        if (searchTerm.length === 0) {
            searchResults.classList.remove('active');
            return;
        }

        // Find matching items
        const matches = Array.from(menuItems).filter(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();
            const itemDescription = item.querySelector('p').textContent.toLowerCase();
            return itemName.includes(searchTerm) || itemDescription.includes(searchTerm);
        });

        // Show results
        if (matches.length > 0) {
            matches.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                
                const name = item.querySelector('h3').textContent;
                const price = item.querySelector('.price').textContent;

                resultItem.innerHTML = `
                    <div class="item-name">${name}</div>
                    <div class="item-price">${price}</div>
                `;

                // Add click handler to scroll to item
                resultItem.addEventListener('click', () => {
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the item briefly
                    item.style.transition = 'background-color 0.3s ease';
                    item.style.backgroundColor = '#fff3cd';
                    setTimeout(() => {
                        item.style.backgroundColor = '';
                    }, 2000);
                    // Clear search
                    searchInput.value = '';
                    searchResults.classList.remove('active');
                });

                searchResults.appendChild(resultItem);
            });
            searchResults.classList.add('active');
        } else {
            searchResults.classList.remove('active');
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // Function to handle cart visibility
    function toggleCart(show) {
        if (show) {
            orderSummary.classList.add('active');
            if (window.innerWidth <= 600) {
                document.body.style.overflow = 'hidden';
            }
        } else {
            orderSummary.classList.remove('active');
            if (window.innerWidth <= 600) {
                document.body.style.overflow = '';
            }
        }
    }

    // Toggle cart panel
    cartToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCart(!orderSummary.classList.contains('active'));
    });

    // Minimize cart
    minimizeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleCart(false);
    });

    // Close cart panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!orderSummary.contains(e.target) && !cartToggle.contains(e.target)) {
            toggleCart(false);
        }
    });

    // Handle touch events for mobile cart
    if (orderContent) {
        let startY;
        let currentY;
        
        orderContent.addEventListener('touchstart', function(e) {
            startY = e.touches[0].clientY;
        }, { passive: true });

        orderContent.addEventListener('touchmove', function(e) {
            if (!startY) return;
            
            currentY = e.touches[0].clientY;
            const diff = currentY - startY;
            
            // Only allow dragging down
            if (diff > 0) {
                e.preventDefault();
                orderContent.style.transform = `translateY(${diff}px)`;
            }
        }, { passive: false });

        orderContent.addEventListener('touchend', function() {
            if (!startY || !currentY) return;
            
            const diff = currentY - startY;
            orderContent.style.transform = '';
            
            // If dragged down more than 100px, close the cart
            if (diff > 100) {
                toggleCart(false);
            }
            
            startY = null;
            currentY = null;
        }, { passive: true });
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            
            // Add item to cart
            cart.push({ name, price });
            
            // Update cart display
            updateCartDisplay();
            
            // Show feedback
            this.classList.add('added');
            if (window.innerWidth > 600) {
                this.querySelector('.sr-only').textContent = 'Added to Cart';
            }
            
            setTimeout(() => {
                this.classList.remove('added');
                if (window.innerWidth > 600) {
                    this.querySelector('.sr-only').textContent = 'Add to Cart';
                }
            }, 1000);

            // Show cart panel
            toggleCart(true);
        });
    });

    // Remove item functionality
    orderItems.addEventListener('click', function(e) {
        e.stopPropagation();
        if (e.target.classList.contains('remove-item')) {
            const index = parseInt(e.target.dataset.index);
            cart.splice(index, 1);
            updateCartDisplay();
            
            // If cart is empty, close it on mobile
            if (cart.length === 0 && window.innerWidth <= 600) {
                toggleCart(false);
            }
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
                    <button class="remove-item" data-index="${index}" aria-label="Remove item">×</button>
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

    // Hamburger menu functionality for mobile nav
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileNav.classList.toggle('open');
        });
        // Close menu when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileNav.classList.remove('open'));
        });
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !hamburger.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
        });
    }
}); 
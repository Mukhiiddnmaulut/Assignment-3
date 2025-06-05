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

    // Create product view container
    const productView = document.createElement('div');
    productView.className = 'product-view';
    productView.innerHTML = `
        <div class="product-container">
            <div class="product-header">
                <div class="logo">
                    <img src="../assets/logo.png" alt="Noodles &amp; More logo" />
                </div>
                <button class="close-product" aria-label="Close product view">×</button>
            </div>
            <div class="product-content">
                <img class="product-image" src="" alt="">
                <h3 class="product-title"></h3>
                <p class="product-description"></p>
                <div class="product-meta"></div>
                <div class="product-price"></div>
                <div class="quantity-selector">
                    <span class="quantity-label">Quantity:</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" aria-label="Decrease quantity">-</button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn increase" aria-label="Increase quantity">+</button>
                    </div>
                </div>
                <button class="add-to-cart-product">Add to Cart</button>
            </div>
        </div>
    `;
    document.body.appendChild(productView);

    // Product view elements
    const productImage = productView.querySelector('.product-image');
    const productTitle = productView.querySelector('.product-title');
    const productDescription = productView.querySelector('.product-description');
    const productMeta = productView.querySelector('.product-meta');
    const productPrice = productView.querySelector('.product-price');
    const addToCartProduct = productView.querySelector('.add-to-cart-product');
    const closeProduct = productView.querySelector('.close-product');
    const quantityValue = productView.querySelector('.quantity-value');
    const decreaseBtn = productView.querySelector('.decrease');
    const increaseBtn = productView.querySelector('.increase');

    // Quantity controls
    let currentQuantity = 1;
    const maxQuantity = 99;

    function updateQuantity(value) {
        currentQuantity = Math.max(1, Math.min(maxQuantity, value));
        quantityValue.textContent = currentQuantity;
        decreaseBtn.disabled = currentQuantity <= 1;
        increaseBtn.disabled = currentQuantity >= maxQuantity;
    }

    decreaseBtn.addEventListener('click', () => updateQuantity(currentQuantity - 1));
    increaseBtn.addEventListener('click', () => updateQuantity(currentQuantity + 1));

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

    // Function to show product view
    function showProductView(item) {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const price = item.querySelector('.price').textContent;
        const spicyLabel = item.querySelector('.spicy-label');
        const addToCartBtn = item.querySelector('.add-to-cart');

        // Reset quantity
        updateQuantity(1);

        // Set product details
        productImage.src = img.src;
        productImage.alt = img.alt;
        productTitle.textContent = title;
        productDescription.textContent = description;
        productPrice.textContent = price;

        // Clear previous meta tags
        productMeta.innerHTML = '';

        // Add meta tags
        if (spicyLabel) {
            const spicyTag = document.createElement('span');
            spicyTag.className = 'product-tag spicy';
            spicyTag.textContent = 'Spicy';
            productMeta.appendChild(spicyTag);
        }

        // Add vegetarian/meat tag based on section and item name
        const section = item.closest('.menu-section');
        if (section) {
            const sectionId = section.id;
            if (sectionId === 'vegetable-meals') {
                const vegTag = document.createElement('span');
                vegTag.className = 'product-tag vegetarian';
                vegTag.textContent = 'Vegetarian';
                productMeta.appendChild(vegTag);
            } else {
                // Check for meat types in the title and description
                const meatTypes = [];
                
                // Check title for meat types
                if (title.toLowerCase().includes('chicken')) {
                    meatTypes.push('Chicken');
                }
                if (title.toLowerCase().includes('beef')) {
                    meatTypes.push('Beef');
                }
                if (title.toLowerCase().includes('pork')) {
                    meatTypes.push('Pork');
                }
                if (title.toLowerCase().includes('seafood') || 
                    title.toLowerCase().includes('prawn') || 
                    title.toLowerCase().includes('fish')) {
                    meatTypes.push('Seafood');
                }

                // Check description for additional meat types
                if (description.toLowerCase().includes('beef') && !meatTypes.includes('Beef')) {
                    meatTypes.push('Beef');
                }
                if (description.toLowerCase().includes('pork') && !meatTypes.includes('Pork')) {
                    meatTypes.push('Pork');
                }
                if (description.toLowerCase().includes('chicken') && !meatTypes.includes('Chicken')) {
                    meatTypes.push('Chicken');
                }
                if ((description.toLowerCase().includes('seafood') || 
                     description.toLowerCase().includes('prawn') || 
                     description.toLowerCase().includes('fish')) && 
                    !meatTypes.includes('Seafood')) {
                    meatTypes.push('Seafood');
                }

                // Add meat tags
                meatTypes.forEach(meatType => {
                    const meatTag = document.createElement('span');
                    meatTag.className = 'product-tag meat';
                    meatTag.textContent = meatType;
                    productMeta.appendChild(meatTag);
                });
            }
        }

        // Set up add to cart button
        addToCartProduct.onclick = () => {
            const name = addToCartBtn.dataset.name;
            const price = parseFloat(addToCartBtn.dataset.price);
            
            // Add multiple items based on quantity
            for (let i = 0; i < currentQuantity; i++) {
                cart.push({ name, price });
            }
            
            updateCartDisplay();
            
            // Show feedback
            addToCartProduct.textContent = 'Added to Cart!';
            addToCartProduct.style.backgroundColor = '#4CAF50';
            
            setTimeout(() => {
                addToCartProduct.textContent = 'Add to Cart';
                addToCartProduct.style.backgroundColor = '';
            }, 1000);

            // Show cart panel
            toggleCart(true);
        };

        // Show product view
        productView.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close product view
    function closeProductView() {
        productView.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for product view
    closeProduct.addEventListener('click', closeProductView);
    productView.addEventListener('click', (e) => {
        if (e.target === productView) {
            closeProductView();
        }
    });

    // Add click handlers to menu items
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't show product view if clicking add to cart button
            if (e.target.closest('.add-to-cart')) return;
            showProductView(item);
        });
    });

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

    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileNav.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
        }
    });

    // Close mobile menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileNav.classList.remove('open');
        });
    });
}); 
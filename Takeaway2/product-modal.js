// Product modal logic for Noodles & More
(function() {
  const productModal = document.getElementById('product-modal');
  const modalImage = document.querySelector('.modal-image');
  const modalTitle = document.querySelector('.modal-title');
  const modalDescription = document.querySelector('.modal-description');
  const modalPrice = document.querySelector('.modal-price');
  const modalAddToCart = document.querySelector('.modal-add-to-cart');
  const closeModalBtn = document.querySelector('.close-modal');

  // Create meta and options containers ONCE
  let modalMeta = document.querySelector('.modal-meta');
  if (!modalMeta) {
    modalMeta = document.createElement('div');
    modalMeta.className = 'modal-meta';
    modalDescription.insertAdjacentElement('afterend', modalMeta);
  }
  let modalOptions = document.querySelector('.modal-options');
  if (!modalOptions) {
    modalOptions = document.createElement('div');
    modalOptions.className = 'modal-options';
    modalMeta.insertAdjacentElement('afterend', modalOptions);
  }

  let modalProduct = null;

  // Open modal on menu item click
  Array.from(document.querySelectorAll('.menu-item')).forEach(item => {
    item.addEventListener('click', function(e) {
      // Prevent add-to-cart button from triggering modal
      if (e.target.closest('.add-to-cart')) return;
      const img = item.querySelector('img');
      const name = item.querySelector('h3').textContent;
      const desc = item.querySelector('p').textContent;
      const price = item.querySelector('.price').textContent;
      const priceValue = item.querySelector('.add-to-cart').dataset.price;
      const meat = item.dataset.meat || '';
      const hasSpiceOption = item.dataset.options === 'spice';
      modalProduct = {
        name,
        price: priceValue,
      };
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalTitle.textContent = name;
      modalDescription.textContent = desc;
      // Update meta
      modalMeta.innerHTML =
        `<span class="modal-meat">${meat ? 'Meat: ' + meat.charAt(0).toUpperCase() + meat.slice(1) : ''}</span>`;
      // Spice level selector
      if (hasSpiceOption) {
        modalOptions.innerHTML = `
          <label for="spice-select" class="modal-options-label">Spice Level:</label>
          <select id="spice-select" class="modal-spice-select">
            <option value="Mild">Mild</option>
            <option value="Medium">Medium</option>
            <option value="Spicy">Spicy</option>
          </select>
        `;
      } else {
        modalOptions.innerHTML = '';
      }
      modalPrice.textContent = price;
      productModal.classList.add('active');
      productModal.style.display = 'flex';
    });
  });

  // Close modal
  function closeProductModal() {
    productModal.classList.remove('active');
    productModal.style.display = 'none';
    // Reset modal content
    modalImage.src = '';
    modalImage.alt = '';
    modalTitle.textContent = '';
    modalDescription.textContent = '';
    modalMeta.innerHTML = '';
    modalOptions.innerHTML = '';
    modalPrice.textContent = '';
    modalProduct = null;
  }
  closeModalBtn.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', function(e) {
    if (e.target === productModal) closeProductModal();
  });

  // Add to cart from modal
  modalAddToCart.addEventListener('click', function(e) {
    e.stopPropagation();
    if (!modalProduct) return;
    let itemName = modalProduct.name;
    if (document.querySelector('.modal-spice-select')) {
      const spice = document.querySelector('.modal-spice-select').value;
      itemName += ` (${spice})`;
    }
    if (window.cart && typeof window.updateCartDisplay === 'function') {
      window.cart.push({ name: itemName, price: parseFloat(modalProduct.price) });
      window.updateCartDisplay();
    }
    closeProductModal();
  });
})(); 
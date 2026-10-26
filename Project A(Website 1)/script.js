// --- Rabet Jewelry: Complete Unified Store Script ---

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. SEARCH & CATEGORY FILTERING
    // ==========================================
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Search bar functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            productCards.forEach(card => {
                const titleElem = card.querySelector('h3');
                const title = titleElem ? titleElem.innerText.toLowerCase() : '';
                
                if (title.includes(term)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Category filter buttons functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    // ==========================================
    // 2. SHOPPING CART, DRAWER & WHATSAPP CHECKOUT
    // ==========================================
    const WHATSAPP_NUMBER = "245119871223"; 
    let cart = [];

    const cartCountElem = document.getElementById('cart-count');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('close-cart-btn');

    // Toggle cart drawer when top-right header cart button is clicked
    if (cartToggleBtn && cartDrawer) {
        cartToggleBtn.addEventListener('click', () => {
            cartDrawer.classList.toggle('open');
            cartDrawer.classList.toggle('active');
        });
    }

    // Close cart drawer when close button (X) is clicked
    if (cartCloseBtn && cartDrawer) {
        cartCloseBtn.addEventListener('click', () => {
            cartDrawer.classList.remove('open');
            cartDrawer.classList.remove('active');
        });
    }

    // Handle "Add to Cart" clicks across all product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const addBtn = card.querySelector('.add-to-cart-btn') || card.querySelector('button');
        
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const titleElem = card.querySelector('h3');
                const priceElem = card.querySelector('.price');

                const title = titleElem ? titleElem.innerText.trim() : 'Jewelry Item';
                const priceText = priceElem ? priceElem.innerText : '0';

                // Robust price cleaning (fixes comma/decimal bugs permanently)
                const digitsOnly = priceText.replace(/\D/g, ''); 
                const price = parseFloat(digitsOnly) || 0;

                // Check if item already exists in cart
                const existingItem = cart.find(item => item.title === title);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ title, price, quantity: 1 });
                }

                updateCartUI();
                
                // Automatically open cart drawer when an item is added
                if (cartDrawer) {
                    cartDrawer.classList.add('open');
                    cartDrawer.classList.add('active');
                }
            });
        }
    });

    // Update Cart UI, Badges, and Totals
    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElem) {
            cartCountElem.innerText = totalItems;
        }

        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElem = document.getElementById('cart-total-price');

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            let totalAmount = 0;

            cart.forEach((item, index) => {
                totalAmount += item.price * item.quantity;

                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `
                    <span>${item.title} (Ksh. ${item.price.toLocaleString()} x ${item.quantity})</span>
                    <div>
                        <button onclick="changeQty(${index}, 1)">+</button>
                        <button onclick="changeQty(${index}, -1)">-</button>
                    </div>
                `;
                cartItemsContainer.appendChild(itemRow);
            });

            if (cartTotalElem) {
                cartTotalElem.innerText = `Ksh. ${totalAmount.toLocaleString()}`;
            }
        }
    }

    // Global quantity adjuster helper
    window.changeQty = function(index, change) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    };

    // WhatsApp Checkout Button Handler
    const whatsappBtn = document.getElementById('checkout-btn') || document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            let message = "Hello Rabet Jewelry, I would like to place an order:%0A%0A";
            let total = 0;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                message += `- ${item.title} (Qty: ${item.quantity}) - Ksh. ${subtotal.toLocaleString()}%0A`;
            });

            message += `%0A*Total Amount: Ksh. ${total.toLocaleString()}*`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }

});

// ==========================================
// LIGHTBOX / ENLARGED IMAGE FEATURE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('close-lightbox');

    // 1. Listen for clicks on any product image
    document.addEventListener('click', (e) => {
        if (e.target.matches('.product-card img')) {
            const imgSrc = e.target.src;
            const imgAlt = e.target.alt || 'Enlarged View';
            
            // Set image and caption content
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightboxCaption.textContent = imgAlt;
            
            // Show the modal
            lightboxModal.classList.add('active');
        }
    });

    // 2. Close modal when clicking the 'X' button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightboxModal.classList.remove('active');
        });
    }

    // 3. Close modal when clicking outside the enlarged image
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                lightboxModal.classList.remove('active');
            }
        });
    }
});

// ==========================================
// BACK TO TOP BUTTON FUNCTIONALITY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // Show or hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Scroll smoothly to top on click
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

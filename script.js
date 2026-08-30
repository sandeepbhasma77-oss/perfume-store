/* ==========================================================================
   ÉLAN PARFUMS — Unified JavaScript
   Preloader · Cursor · Navbar · Cart · Wishlist · Search · Filters · Reveals
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* -----------------------------------------
       1. PRELOADER
       ----------------------------------------- */
    const preloader = document.querySelector('.preloader');
    const body = document.body;

    function hidePreloader() {
        if (preloader) preloader.classList.add('hidden');
        body.classList.add('page-ready');
        setTimeout(() => {
            const hero = document.querySelector('.hero');
            if (hero) hero.classList.add('is-loaded');
        }, 100);
    }

    if (preloader) {
        const forceHide = setTimeout(hidePreloader, 4000);
        window.addEventListener('load', () => {
            clearTimeout(forceHide);
            setTimeout(hidePreloader, 600);
        });
    } else {
        body.classList.add('page-ready');
        const hero = document.querySelector('.hero');
        if (hero) hero.classList.add('is-loaded');
    }

    /* -----------------------------------------
       2. CUSTOM CURSOR (desktop only)
       ----------------------------------------- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });
        (function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        })();
        document.querySelectorAll('a, button, .clean-wishlist-btn, .clean-cart-btn, .filter-pill, .clean-product-image').forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.closest('.clean-product-image') || el.tagName === 'IMG') {
                    cursorRing.classList.add('cursor-image');
                } else {
                    cursorRing.style.width = '48px';
                    cursorRing.style.height = '48px';
                }
                body.classList.add('cursor-active');
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('cursor-image');
                cursorRing.style.width = '32px';
                cursorRing.style.height = '32px';
                body.classList.remove('cursor-active');
            });
        });
    }

    /* -----------------------------------------
       3. NAVBAR — scrolled state + active link
       ----------------------------------------- */
    const header = document.querySelector('header');
    if (header) {
        const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    /* -----------------------------------------
       4. MOBILE HAMBURGER MENU
       ----------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* -----------------------------------------
       5. HERO PARALLAX (subtle float)
       ----------------------------------------- */
    const heroBgImage = document.querySelector('.hero-bg-image');
    if (heroBgImage) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scroll = window.scrollY;
                    if (scroll < window.innerHeight) {
                        heroBgImage.style.transform = `translateY(${scroll * 0.08}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* -----------------------------------------
       6. CART SYSTEM (localStorage-persisted)
       ----------------------------------------- */
    const CART_KEY = 'elan_cart';
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCartSidebar();
        renderCartPage();
        updateCartCount();
    }

    function addToCart(name, price, image, qty = 1) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.qty += qty;
        } else {
            cart.push({ name, price, image, qty });
        }
        saveCart();
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
    }

    function updateCartQty(name, delta) {
        const item = cart.find(i => i.name === name);
        if (!item) return;
        item.qty = Math.max(1, item.qty + delta);
        saveCart();
    }

    function getCartTotal() {
        return cart.reduce((sum, item) => {
            const p = parseFloat(item.price.replace('$', '')) || 0;
            return sum + p * item.qty;
        }, 0);
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.qty, 0);
        document.querySelectorAll('#cart-count').forEach(el => el.textContent = count);
    }

    function renderCartSidebar() {
        const container = document.getElementById('cart-items');
        const totalEl = document.getElementById('cart-total');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your bag is empty</h3>
                    <p>Discover our signature fragrances to begin</p>
                </div>`;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item-row" data-name="${item.name}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                        <div class="cart-item-qty">
                            <button class="qty-minus" aria-label="Decrease quantity">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-plus" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" aria-label="Remove ${item.name}"><i class="fas fa-times"></i></button>
                </div>`).join('');

            container.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.closest('.cart-item-row').dataset.name;
                    updateCartQty(name, -1);
                });
            });
            container.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', () => {
                    const name = btn.closest('.cart-item-row').dataset.name;
                    updateCartQty(name, 1);
                });
            });
            container.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const row = btn.closest('.cart-item-row');
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(20px)';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        removeFromCart(row.dataset.name);
                    }, 300);
                });
            });
        }
        if (totalEl) totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
    }

    function renderCartPage() {
        const container = document.getElementById('cart-page-items');
        const subtotalEl = document.getElementById('cart-page-total');
        if (!container) return;

        if (cart.length === 0) {
            container.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>Your bag is empty</h3>
                    <p>Discover our signature fragrances to begin</p>
                    <a href="shop.html" class="btn-primary cart-continue-btn">Explore the Collection</a>
                </div>`;
        } else {
            container.innerHTML = cart.map(item => `
                <div class="cart-item-row" data-name="${item.name}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${item.price}</p>
                        <div class="cart-item-qty">
                            <button class="qty-minus" aria-label="Decrease quantity">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-plus" aria-label="Increase quantity">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" aria-label="Remove ${item.name}"><i class="fas fa-times"></i></button>
                </div>`).join('');

            container.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', () => updateCartQty(btn.closest('.cart-item-row').dataset.name, -1));
            });
            container.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', () => updateCartQty(btn.closest('.cart-item-row').dataset.name, 1));
            });
            container.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', () => {
                    const row = btn.closest('.cart-item-row');
                    row.style.opacity = '0';
                    row.style.transform = 'translateX(20px)';
                    row.style.transition = 'all 0.3s ease';
                    setTimeout(() => removeFromCart(row.dataset.name), 300);
                });
            });
        }
        if (subtotalEl) subtotalEl.textContent = `$${getCartTotal().toFixed(2)}`;
    }

    // Cart sidebar open/close
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');

    function openCart() {
        if (cartOverlay) cartOverlay.classList.add('active');
        if (cartSidebar) cartSidebar.classList.add('active');
        body.style.overflow = 'hidden';
    }
    function closeCart() {
        if (cartOverlay) cartOverlay.classList.remove('active');
        if (cartSidebar) cartSidebar.classList.remove('active');
        body.style.overflow = '';
    }

    document.querySelectorAll('.open-cart').forEach(btn =>
        btn.addEventListener('click', (e) => { e.preventDefault(); openCart(); })
    );
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // "Add to Bag" buttons
    document.querySelectorAll('.clean-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.clean-product-card');
            if (!card) return;
            const name = card.querySelector('h3')?.textContent?.trim() || '';
            const price = card.querySelector('.clean-product-price')?.textContent?.trim() || '$0';
            const img = card.querySelector('.clean-product-image img')?.getAttribute('src') || '';
            addToCart(name, price, img);
            openCart();
            const original = btn.textContent;
            btn.textContent = 'ADDED';
            btn.style.backgroundColor = 'var(--dark)';
            btn.style.color = 'var(--cream)';
            btn.style.borderColor = 'var(--dark)';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.borderColor = '';
            }, 1200);
        });
    });

    // Initialize cart rendering
    renderCartSidebar();
    renderCartPage();
    updateCartCount();

    /* -----------------------------------------
       7. WISHLIST (localStorage-persisted)
       ----------------------------------------- */
    const WISH_KEY = 'elan_wishlist';
    let wishlist = JSON.parse(localStorage.getItem(WISH_KEY)) || [];

    function saveWishlist() {
        localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
        updateWishlistCount();
    }

    function toggleWishlist(name) {
        if (wishlist.includes(name)) {
            wishlist = wishlist.filter(n => n !== name);
        } else {
            wishlist.push(name);
        }
        saveWishlist();
    }

    function updateWishlistCount() {
        document.querySelectorAll('#wishlist-count').forEach(el => el.textContent = wishlist.length);
    }

    document.querySelectorAll('.clean-wishlist-btn').forEach(btn => {
        const card = btn.closest('.clean-product-card');
        if (!card) return;
        const name = card.querySelector('h3')?.textContent?.trim() || '';
        if (wishlist.includes(name)) {
            btn.classList.add('active');
            const icon = btn.querySelector('i');
            if (icon) { icon.classList.remove('far'); icon.classList.add('fas'); }
        }
        btn.addEventListener('click', () => {
            toggleWishlist(name);
            btn.classList.toggle('active');
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
            }
        });
    });

    updateWishlistCount();

    /* -----------------------------------------
       8. SEARCH OVERLAY (with product search)
       ----------------------------------------- */
    const searchOverlay = document.querySelector('.search-overlay');
    const openSearchBtns = document.querySelectorAll('.open-search');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;
    const searchContainer = searchOverlay ? searchOverlay.querySelector('.search-container') : null;

    // All searchable products
    const allProducts = [
        { name: 'SANTAL NO.03', family: 'Woody / Amber', price: '$120.00', image: 'Images/elan-hero.jpg', url: 'shop.html' },
        { name: 'NOIR NO.07', family: 'Woody / Spicy', price: '$135.00', image: 'Images/elan-noir.jpg', url: 'shop.html' },
        { name: 'ÉCLAT NO.05', family: 'Floral / Musk', price: '$110.00', image: 'Images/elan-eclat.jpg', url: 'shop.html' },
        { name: 'AMBRE NO.01', family: 'Amber / Cashmere', price: '$145.00', image: 'Images/brand-story.jpg', url: 'shop.html' },
        { name: 'ROYAL OUD NO.09', family: 'Oud / Smoked Resin', price: '$160.00', image: 'Images/parallax-bg.jpg', url: 'shop.html' },
        { name: 'FLEUR BLANCHE NO.02', family: 'Floral / Radiant', price: '$115.00', image: 'Images/FLEUR BLANCHE NO.02.jpeg', url: 'shop.html' },
        { name: 'VETIVER PUR NO.04', family: 'Fresh / Citrus Cedar', price: '$125.00', image: 'Images/1.jpeg', url: 'shop.html' },
        { name: 'CUIR INTENSE NO.08', family: 'Leather / Saffron Oud', price: '$150.00', image: 'Images/elan-presence.jpg', url: 'shop.html' },
    ];

    function renderSearchResults(query) {
        let existing = searchContainer.querySelector('.search-results');
        if (!existing) {
            existing = document.createElement('div');
            existing.className = 'search-results';
            searchContainer.appendChild(existing);
        }

        if (!query || query.length < 2) {
            existing.innerHTML = '';
            existing.style.display = 'none';
            return;
        }

        const q = query.toLowerCase();
        const results = allProducts.filter(p =>
            p.name.toLowerCase().includes(q) || p.family.toLowerCase().includes(q)
        );

        if (results.length === 0) {
            existing.innerHTML = '<p class="search-no-results">No fragrances found</p>';
            existing.style.display = 'block';
            return;
        }

        existing.innerHTML = results.map(p => `
            <a href="${p.url}" class="search-result-item">
                <img src="${p.image}" alt="${p.name}">
                <div>
                    <strong>${p.name}</strong>
                    <span>${p.family} — ${p.price}</span>
                </div>
            </a>`).join('');
        existing.style.display = 'block';
    }

    function openSearch() {
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            body.style.overflow = 'hidden';
            if (searchInput) setTimeout(() => searchInput.focus(), 300);
        }
    }
    function closeSearch() {
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            body.style.overflow = '';
            if (searchInput) searchInput.value = '';
            const results = searchContainer?.querySelector('.search-results');
            if (results) results.style.display = 'none';
        }
    }

    openSearchBtns.forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openSearch(); }));
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
    if (searchOverlay) searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
    if (searchInput) searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));

    /* -----------------------------------------
       9. SHOP FILTER PILLS (actual filtering)
       ----------------------------------------- */
    const filterPills = document.querySelectorAll('.filter-pill');
    const shopProducts = document.querySelectorAll('.products-grid-clean .clean-product-card');

    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterVal = (pill.dataset.filter || pill.textContent.trim().toLowerCase());

            shopProducts.forEach(card => {
                const cardCategories = (card.dataset.category || '').toLowerCase();
                if (filterVal === 'all') {
                    card.style.display = '';
                } else {
                    card.style.display = cardCategories.includes(filterVal) ? '' : 'none';
                }
            });
        });
    });

    // Shop live search
    const shopSearch = document.getElementById('shop-live-search');
    if (shopSearch) {
        shopSearch.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase().trim();
            shopProducts.forEach(card => {
                const name = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const family = card.querySelector('.clean-product-family')?.textContent?.toLowerCase() || '';
                card.style.display = (!q || name.includes(q) || family.includes(q)) ? '' : 'none';
            });
        });
    }

    // Sort dropdown
    const sortSelect = document.querySelector('.filter-sort select');
    if (sortSelect && shopProducts.length > 0) {
        sortSelect.addEventListener('change', () => {
            const grid = document.querySelector('.products-grid-clean');
            if (!grid) return;
            const cards = Array.from(grid.querySelectorAll('.clean-product-card'));
            const val = sortSelect.value;

            cards.sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || a.querySelector('.clean-product-price')?.textContent.replace('$', '')) || 0;
                const priceB = parseFloat(b.dataset.price || b.querySelector('.clean-product-price')?.textContent.replace('$', '')) || 0;
                if (val === 'price-low') return priceA - priceB;
                if (val === 'price-high') return priceB - priceA;
                return 0;
            });
            cards.forEach(card => grid.appendChild(card));
        });
    }

    // Mobile filter drawer toggle
    const filterToggle = document.querySelector('.filter-toggle-btn');
    const filterDrawer = document.querySelector('.filter-drawer');
    const filterOverlay = document.querySelector('.filter-drawer-overlay');
    if (filterToggle && filterDrawer) {
        filterToggle.addEventListener('click', () => {
            filterToggle.classList.toggle('active');
            filterDrawer.classList.toggle('active');
            if (filterOverlay) filterOverlay.classList.toggle('active');
        });
        if (filterOverlay) {
            filterOverlay.addEventListener('click', () => {
                filterToggle.classList.remove('active');
                filterDrawer.classList.remove('active');
                filterOverlay.classList.remove('active');
            });
        }
    }

    /* -----------------------------------------
       10. SCROLL REVEAL (IntersectionObserver)
       ----------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* -----------------------------------------
       11. SMOOTH SCROLL for anchor links
       ----------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (hamburger) hamburger.classList.remove('active');
                if (navLinks) navLinks.classList.remove('active');
            }
        });
    });

    /* -----------------------------------------
       12. PAGE TRANSITIONS
       ----------------------------------------- */
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('http') || link.target === '_blank') return;
        if (href === currentPage) return;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            body.classList.add('page-exiting');
            setTimeout(() => { window.location.href = href; }, 450);
        });
    });

    /* -----------------------------------------
       13. COLLECTION SPLIT HOVER parallax
       ----------------------------------------- */
    document.querySelectorAll('.collection-split-row').forEach(row => {
        const img = row.querySelector('.collection-split-img img');
        if (!img) return;
        row.addEventListener('mousemove', (e) => {
            const rect = row.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            img.style.transform = `scale(1.04) translate(${x * -8}px, ${y * -8}px)`;
        });
        row.addEventListener('mouseleave', () => { img.style.transform = ''; });
    });

    /* -----------------------------------------
       14. PRODUCT CARD TILT (subtle)
       ----------------------------------------- */
    document.querySelectorAll('.clean-product-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-5px) perspective(800px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });

    /* -----------------------------------------
       15. CONTACT FORM HANDLER
       ----------------------------------------- */
    const contactForm = document.querySelector('.contact-minimal-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            if (btn) {
                const orig = btn.textContent;
                btn.textContent = 'MESSAGE SENT';
                btn.disabled = true;
                setTimeout(() => { btn.textContent = orig; btn.disabled = false; contactForm.reset(); }, 2500);
            }
        });
    }

    /* -----------------------------------------
       16. ESC KEY closes overlays
       ----------------------------------------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeCart(); closeSearch(); }
    });

});

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

    // Use the product ID as the source of truth.
    // Never create a separate product object for cart items.
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
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
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
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
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

    // "Add to Cart" buttons — guarded against duplicate binding.
    // Prefers data-id + ELAN_PRODUCTS so Shop and Search add the identical product.
    function showToast(msg) {
        let toast = document.getElementById('elan-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'elan-toast';
            toast.id = 'elan-toast';
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.innerHTML = '<i class="fas fa-check"></i><span></span>';
        toast.querySelector('span').textContent = msg || 'Added to cart';
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function resolveProductFromCard(card) {
        const catalog = window.ELAN_PRODUCTS || [];
        const map = window.ELAN_PRODUCT_MAP || {};
        const id = card?.dataset?.id || card?.getAttribute?.('data-id') || '';
        if (id && map[id]) {
            const p = map[id];
            return { id: p.id, name: p.name, price: p.priceDisplay, image: p.image };
        }
        const name = card?.querySelector('h3')?.textContent?.trim() || '';
        if (name && catalog.length) {
            const found = catalog.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (found) return { id: found.id, name: found.name, price: found.priceDisplay, image: found.image };
        }
        return {
            id: id || name,
            name: name,
            price: card?.querySelector('.clean-product-price')?.textContent?.trim() || '$0',
            image: card?.querySelector('.clean-product-image img')?.getAttribute('src') || ''
        };
    }

    function bindAddToCartButtons(root) {
        (root || document).querySelectorAll('.clean-cart-btn').forEach(btn => {
            if (btn.dataset.cartBound) return;
            btn.dataset.cartBound = 'true';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const card = btn.closest('.clean-product-card');
                if (!card) return;
                const prod = resolveProductFromCard(card);
                if (!prod.name) return;
                addToCart(prod.name, prod.price, prod.image);
                openCart();
                showToast('Added to cart — ' + prod.name);
                const original = btn.textContent;
                btn.textContent = 'ADDED TO CART';
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
    }
    bindAddToCartButtons(document);

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

    function wishlistNameForCard(card) {
        const catalog = window.ELAN_PRODUCTS || [];
        const map = window.ELAN_PRODUCT_MAP || {};
        const id = card?.dataset?.id || '';
        if (id && map[id]) return map[id].name;
        const name = card?.querySelector('h3')?.textContent?.trim() || '';
        if (name && catalog.length) {
            const fold = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const found = catalog.find(p => fold(p.name) === fold(name));
            if (found) return found.name;
        }
        return name;
    }

    function paintWishlistBtn(btn, isActive) {
        btn.classList.toggle('active', isActive);
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.toggle('far', !isActive);
            icon.classList.toggle('fas', isActive);
            if (isActive) { icon.classList.remove('far'); icon.classList.add('fas'); }
            else { icon.classList.remove('fas'); icon.classList.add('far'); }
        }
    }

    function bindWishlistButtons(root) {
        (root || document).querySelectorAll('.clean-wishlist-btn').forEach(btn => {
            if (btn.dataset.wishBound) return;
            btn.dataset.wishBound = 'true';
            const card = btn.closest('.clean-product-card');
            const name = wishlistNameForCard(card);
            if (name && wishlist.includes(name)) paintWishlistBtn(btn, true);
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const nm = wishlistNameForCard(btn.closest('.clean-product-card'));
                if (!nm) return;
                toggleWishlist(nm);
                paintWishlistBtn(btn, wishlist.includes(nm));
            });
        });
    }
    bindWishlistButtons(document);

    updateWishlistCount();

    /* -----------------------------------------
       8. COMPACT LUXURY SEARCH PANEL (no fullscreen overlay)
       ----------------------------------------- */
    const searchOverlay = document.querySelector('.search-overlay');
    const openSearchBtns = document.querySelectorAll('.open-search');
    const closeSearchBtn = document.querySelector('.close-search');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input') : null;
    const searchContainer = searchOverlay ? searchOverlay.querySelector('.search-container') : null;

    // Single source of truth: ELAN_PRODUCTS (products.js). Fallback kept for safety.
    const allProducts = (window.ELAN_PRODUCTS && window.ELAN_PRODUCTS.length ? window.ELAN_PRODUCTS : [
        { id: 'santal-no03', name: 'SANTAL NO.03', family: 'Woody / Amber', desc: 'Creamy sandalwood, cardamom and warm amber', category: 'unisex woody bestsellers eau de parfum', priceDisplay: '$120.00', price: 120, image: 'Images/elan-hero.jpg' },
        { id: 'noir-no07', name: 'NOIR NO.07', family: 'Woody / Spicy', desc: 'Smoked cedar, black pepper and dark vanilla', category: 'men woody new arrivals eau de parfum', priceDisplay: '$135.00', price: 135, image: 'Images/elan-noir.jpg' },
        { id: 'eclat-no05', name: 'ÉCLAT NO.05', family: 'Floral / Musk', desc: 'White petals, dewy musk and morning light', category: 'women floral fresh bestsellers eau de parfum', priceDisplay: '$110.00', price: 110, image: 'Images/elan-eclat.jpg' },
        { id: 'ambre-no01', name: 'AMBRE NO.01', family: 'Amber / Cashmere', desc: 'Golden amber wrapped in cashmere woods', category: 'unisex woody amber eau de parfum', priceDisplay: '$145.00', price: 145, image: 'Images/brand-story.jpg' },
        { id: 'royal-oud-no09', name: 'ROYAL OUD NO.09', family: 'Oud / Smoked Resin', desc: 'Laotian oud, smoked resin and leather', category: 'men oud woody eau de parfum', priceDisplay: '$160.00', price: 160, image: 'Images/parallax-bg.jpg' },
        { id: 'fleur-blanche-no02', name: 'FLEUR BLANCHE NO.02', family: 'Floral / Radiant', desc: 'Orange blossom, white tea and soft woods', category: 'women floral fresh new arrivals eau de parfum', priceDisplay: '$115.00', price: 115, image: 'Images/FLEUR BLANCHE NO.02.jpeg' },
        { id: 'vetiver-pur-no04', name: 'VÉTIVER PUR NO.04', family: 'Fresh / Citrus Cedar', desc: 'Haitian vetiver, bergamot and dry cedar', category: 'men fresh woody eau de parfum', priceDisplay: '$125.00', price: 125, image: 'Images/1.jpeg' },
        { id: 'cuir-intense-no08', name: 'CUIR INTENSE NO.08', family: 'Leather / Saffron Oud', desc: 'Supple leather, saffron and oud', category: 'unisex oud leather woody eau de parfum', priceDisplay: '$150.00', price: 150, image: 'Images/elan-presence.jpg' },
        { id: 'discovery-atelier-set', name: 'DISCOVERY ATELIER SET', family: 'Discovery Set', desc: 'Four miniatures — santal, noir, eclat and ambre', category: 'unisex discovery sets eau de parfum', priceDisplay: '$48.00', price: 48, image: 'Images/Luxury_perfume.jpeg' },
        { id: 'les-iconiques-set', name: 'LES ICONIQUES SET', family: 'Discovery Set / Oud', desc: 'Oud, cuir, ambre and vetiver miniatures', category: 'unisex discovery sets oud eau de parfum', priceDisplay: '$58.00', price: 58, image: 'Images/homepage.jpeg' },
    ]);

    function norm(s) {
        return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Search results must navigate to the exact product
    // using its unique product ID.
    function productUrl(p) {
        return 'product.html?id=' + encodeURIComponent(p.id);
    }

    let searchHighlight = -1;

    function getSearchResultsEl() {
        if (!searchContainer) return null;
        let el = searchContainer.querySelector('.search-results');
        if (!el) {
            el = document.createElement('div');
            el.className = 'search-results';
            el.setAttribute('role', 'listbox');
            searchContainer.appendChild(el);
        }
        return el;
    }

    function renderSearchResults(query) {
        const box = getSearchResultsEl();
        if (!box) return;
        const q = norm(query).trim();
        searchHighlight = -1;
        if (!q) {
            box.innerHTML = '';
            box.style.display = 'none';
            box.classList.remove('has-results');
            if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
            return;
        }
        const results = allProducts.filter(p =>
            norm(p.name).includes(q) ||
            norm(p.family).includes(q) ||
            norm(p.description || p.desc).includes(q) ||
            norm(p.tags || p.category).includes(q)
        ).slice(0, 6);

        if (results.length === 0) {
            box.innerHTML = '<p class="search-no-results">NO FRAGRANCE FOUND</p><p class="search-no-results-sub">Try another fragrance or collection.</p>';
            box.style.display = 'block';
            box.classList.add('has-results');
            if (searchInput) searchInput.setAttribute('aria-expanded', 'false');
            return;
        }

        box.innerHTML = results.map((p, i) => {
            const price = p.priceDisplay || (typeof p.price === 'number' ? ('$' + p.price.toFixed(2)) : p.price);
            return `
            <a href="${productUrl(p)}" class="search-result-item" role="option" data-index="${i}" data-id="${p.id}" aria-selected="false">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div>
                    <strong>${p.name}</strong>
                    <span>${p.family}</span>
                </div>
                <span class="search-price">${price}</span>
            </a>`;
        }).join('');
        box.style.display = 'block';
        box.classList.add('has-results');
        if (searchInput) searchInput.setAttribute('aria-expanded', 'true');
    }

    function setHighlight(items, idx) {
        items.forEach((it, i) => {
            const on = i === idx;
            it.classList.toggle('highlighted', on);
            it.setAttribute('aria-selected', on ? 'true' : 'false');
            if (on) it.scrollIntoView({ block: 'nearest' });
        });
    }

    function isSearchOpen() {
        return !!(searchOverlay && searchOverlay.classList.contains('active'));
    }

    function openSearch() {
        if (!searchOverlay) return;
        if (isSearchOpen()) {
            if (searchInput) searchInput.focus();
            return;
        }
        searchOverlay.classList.add('active');
        // Site stays visible & usable — no scroll lock, no dark overlay
        if (searchInput) setTimeout(() => searchInput.focus(), 60);
    }
    function closeSearch() {
        if (!searchOverlay) return;
        if (!isSearchOpen()) return;
        searchOverlay.classList.remove('active');
        if (searchInput) {
            searchInput.value = '';
            searchInput.setAttribute('aria-expanded', 'false');
            searchInput.blur();
        }
        const results = searchContainer?.querySelector('.search-results');
        if (results) {
            results.innerHTML = '';
            results.style.display = 'none';
            results.classList.remove('has-results');
        }
        searchHighlight = -1;
    }

    openSearchBtns.forEach(btn => {
        if (btn.dataset.searchBound) return;
        btn.dataset.searchBound = 'true';
        btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); isSearchOpen() ? closeSearch() : openSearch(); });
    });
    if (closeSearchBtn && !closeSearchBtn.dataset.searchBound) {
        closeSearchBtn.dataset.searchBound = 'true';
        closeSearchBtn.addEventListener('click', (e) => { e.stopPropagation(); closeSearch(); });
    }
    // Click outside closes — no fullscreen overlay element
    if (!document.documentElement.dataset.luxSearchOutside) {
        document.documentElement.dataset.luxSearchOutside = 'true';
        document.addEventListener('click', (e) => {
            if (!isSearchOpen()) return;
            if (searchContainer && searchContainer.contains(e.target)) return;
            const opener = e.target.closest ? e.target.closest('.open-search') : null;
            if (opener) return;
            closeSearch();
        });
    }
    if (searchInput && !searchInput.dataset.searchBound) {
        searchInput.dataset.searchBound = 'true';
        searchInput.addEventListener('input', (e) => { e.stopPropagation(); renderSearchResults(e.target.value); });
        searchInput.addEventListener('click', (e) => e.stopPropagation());
        searchInput.addEventListener('keydown', (e) => {
            const box = getSearchResultsEl();
            const items = box ? Array.from(box.querySelectorAll('.search-result-item')) : [];
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                if (!items.length) return;
                e.preventDefault();
                searchHighlight = e.key === 'ArrowDown'
                    ? (searchHighlight + 1) % items.length
                    : (searchHighlight - 1 + items.length) % items.length;
                setHighlight(items, searchHighlight);
            } else if (e.key === 'Enter') {
                if (searchHighlight >= 0 && items[searchHighlight]) {
                    e.preventDefault();
                    window.location.href = items[searchHighlight].getAttribute('href');
                } else if (items.length === 1) {
                    e.preventDefault();
                    window.location.href = items[0].getAttribute('href');
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeSearch();
            }
        });
    }
    if (searchContainer && !searchContainer.dataset.searchBound) {
        searchContainer.dataset.searchBound = 'true';
        searchContainer.addEventListener('click', (e) => e.stopPropagation());
    }
    // "/" opens search when not typing in a form field
    if (!document.documentElement.dataset.luxSearchSlash) {
        document.documentElement.dataset.luxSearchSlash = 'true';
        document.addEventListener('keydown', (e) => {
            const t = e.target;
            const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
            if (e.key === '/' && !typing && !isSearchOpen()) {
                e.preventDefault();
                openSearch();
            }
        });
    }

    /* -----------------------------------------
       9. SHOP FILTER + SEARCH + SORT (combined, single source)
       ----------------------------------------- */
    const filterPills = document.querySelectorAll('.filter-pill');
    const shopProducts = document.querySelectorAll('#shop-products-grid .clean-product-card');
    let activeFilter = 'all';
    let activeQuery = '';
    let activeSort = 'featured';
    const shopGrid = document.getElementById('shop-products-grid') || document.querySelector('.products-grid-clean');
    const resultCount = document.getElementById('shop-result-count');
    const noResults = document.getElementById('shop-no-results');
    const shopSearch = document.getElementById('shop-live-search');
    const clearSearchBtn = document.getElementById('shop-clear-search');
    const sortSelect = document.getElementById('shop-sort');
    const resetFiltersBtn = document.getElementById('shop-reset-filters');
    const originalOrder = shopGrid ? Array.from(shopGrid.querySelectorAll('.clean-product-card')) : [];

    function applyShopFilters() {
        if (!shopGrid) return;
        let visible = 0;
        const cards = Array.from(shopGrid.querySelectorAll('.clean-product-card'));
        cards.forEach(card => {
            const cats = norm(card.dataset.category);
            const name = norm(card.dataset.name || card.querySelector('h3')?.textContent || '');
            const family = norm(card.querySelector('.clean-product-family')?.textContent || '');
            const desc = norm(card.querySelector('.clean-product-desc')?.textContent || '');
            const matchFilter = activeFilter === 'all' || cats.includes(activeFilter);
            const matchQuery = !activeQuery || name.includes(activeQuery) || family.includes(activeQuery) || desc.includes(activeQuery);
            const show = matchFilter && matchQuery;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        // sort the collection grid (Best Selling + Newest come from products.js)
        const val = activeSort;
        if (val && val !== 'featured') {
            const catalog = window.ELAN_PRODUCT_MAP || {};
            const rankOf = (card) => {
                const p = catalog[card.dataset.id];
                return p && typeof p.popularity === 'number' ? p.popularity : 99;
            };
            const addedOf = (card) => {
                const p = catalog[card.dataset.id];
                return p && typeof p.added === 'number' ? p.added : 0;
            };
            const sorted = Array.from(shopGrid.querySelectorAll('.clean-product-card')).sort((a, b) => {
                const priceA = parseFloat(a.dataset.price || (a.querySelector('.clean-product-price')?.textContent || '').replace(/[^0-9.]/g, '')) || 0;
                const priceB = parseFloat(b.dataset.price || (b.querySelector('.clean-product-price')?.textContent || '').replace(/[^0-9.]/g, '')) || 0;
                const nameA = (a.dataset.name || a.querySelector('h3')?.textContent || '').toLowerCase();
                const nameB = (b.dataset.name || b.querySelector('h3')?.textContent || '').toLowerCase();
                if (val === 'price-low') return priceA - priceB;
                if (val === 'price-high') return priceB - priceA;
                if (val === 'name-az') return nameA.localeCompare(nameB);
                if (val === 'best-selling') return rankOf(a) - rankOf(b);
                if (val === 'newest') return addedOf(b) - addedOf(a);
                return 0;
            });
            sorted.forEach(card => shopGrid.appendChild(card));
        } else if (originalOrder.length) {
            // restore featured order
            originalOrder.forEach(card => { if (card.isConnected) shopGrid.appendChild(card); });
            // re-apply visibility after reorder
            Array.from(shopGrid.querySelectorAll('.clean-product-card')).forEach(card => {
                const cats = norm(card.dataset.category);
                const name = norm(card.dataset.name || card.querySelector('h3')?.textContent || '');
                const family = norm(card.querySelector('.clean-product-family')?.textContent || '');
                const desc = norm(card.querySelector('.clean-product-desc')?.textContent || '');
                const show = (activeFilter === 'all' || cats.includes(activeFilter)) && (!activeQuery || name.includes(activeQuery) || family.includes(activeQuery) || desc.includes(activeQuery));
                card.style.display = show ? '' : 'none';
            });
        }
        if (resultCount) resultCount.textContent = visible === 1 ? 'Showing 1 fragrance' : `Showing ${visible} fragrances`;
        if (noResults) noResults.hidden = visible !== 0;
        if (clearSearchBtn && shopSearch) clearSearchBtn.hidden = !shopSearch.value;
    }

    filterPills.forEach(pill => {
        if (pill.dataset.filterBound) return;
        pill.dataset.filterBound = 'true';
        pill.addEventListener('click', () => {
            filterPills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
            pill.classList.add('active');
            pill.setAttribute('aria-selected', 'true');
            activeFilter = (pill.dataset.filter || 'all').toLowerCase();
            applyShopFilters();
        });
    });

    // Shop live search — instant, no reload
    if (shopSearch && !shopSearch.dataset.bound) {
        shopSearch.dataset.bound = 'true';
        shopSearch.addEventListener('input', (e) => {
            activeQuery = norm(e.target.value).trim();
            applyShopFilters();
        });
    }
    if (clearSearchBtn && shopSearch && !clearSearchBtn.dataset.bound) {
        clearSearchBtn.dataset.bound = 'true';
        clearSearchBtn.addEventListener('click', () => {
            shopSearch.value = '';
            activeQuery = '';
            applyShopFilters();
            shopSearch.focus();
        });
    }
    if (resetFiltersBtn && !resetFiltersBtn.dataset.bound) {
        resetFiltersBtn.dataset.bound = 'true';
        resetFiltersBtn.addEventListener('click', () => {
            activeFilter = 'all';
            activeQuery = '';
            activeSort = 'featured';
            filterPills.forEach(p => p.classList.remove('active'));
            const all = document.querySelector('.filter-pill[data-filter="all"]');
            if (all) all.classList.add('active');
            if (shopSearch) shopSearch.value = '';
            if (sortSelect) sortSelect.value = 'featured';
            applyShopFilters();
        });
    }

    // Sort dropdown
    if (sortSelect && !sortSelect.dataset.bound) {
        sortSelect.dataset.bound = 'true';
        sortSelect.addEventListener('change', () => {
            activeSort = sortSelect.value;
            applyShopFilters();
        });
    }
    if (shopGrid) applyShopFilters();

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
       15. CONTACT FORM HANDLER — loading + MESSAGE RECEIVED
       ----------------------------------------- */
    const contactForm = document.getElementById('contact-form') || document.querySelector('.contact-minimal-form form');
    if (contactForm && !contactForm.dataset.bound) {
        contactForm.dataset.bound = 'true';
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('contact-name');
            const emailInput = document.getElementById('contact-email');
            const msgInput = document.getElementById('contact-message');
            // native-feel validation
            let valid = true;
            [nameInput, emailInput, msgInput].forEach(inp => {
                if (!inp) return;
                const bad = !inp.value.trim() || (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim()));
                inp.style.borderBottomColor = bad ? '#c94a4a' : '';
                if (bad) valid = false;
            });
            if (!valid) {
                showToast('Please complete name, email and message');
                (nameInput && !nameInput.value.trim() ? nameInput : emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim()) ? emailInput : msgInput).focus();
                return;
            }
            const btn = document.getElementById('contact-submit') || contactForm.querySelector('button[type="submit"]');
            const label = btn ? btn.querySelector('.btn-label') : null;
            if (btn) {
                btn.disabled = true;
                if (label) label.textContent = 'SENDING...';
                else btn.textContent = 'SENDING...';
            }
            setTimeout(() => {
                contactForm.style.display = 'none';
                const success = document.getElementById('contact-success');
                if (success) {
                    success.hidden = false;
                    success.classList.add('show');
                } else if (btn) {
                    if (label) label.textContent = 'MESSAGE SENT';
                    else btn.textContent = 'MESSAGE SENT';
                }
                showToast('Message received');
            }, 900);
        });
        ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('input', () => { el.style.borderBottomColor = ''; });
        });
        const againBtn = document.getElementById('contact-again');
        if (againBtn) againBtn.addEventListener('click', () => {
            const success = document.getElementById('contact-success');
            if (success) success.hidden = true;
            contactForm.reset();
            contactForm.style.display = '';
            const btn = document.getElementById('contact-submit');
            if (btn) {
                btn.disabled = false;
                const label = btn.querySelector('.btn-label');
                if (label) label.textContent = 'SEND MESSAGE';
            }
        });
    }

    /* -----------------------------------------
       16. FAQ ACCORDION (vanilla JS)
       ----------------------------------------- */
    document.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-q');
        const a = item.querySelector('.faq-a');
        if (!q || !a || q.dataset.bound) return;
        q.dataset.bound = 'true';
        q.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(other => {
                other.classList.remove('open');
                const oa = other.querySelector('.faq-a');
                const oq = other.querySelector('.faq-q');
                if (oa) oa.style.maxHeight = null;
                if (oq) oq.setAttribute('aria-expanded', 'false');
            });
            if (!isOpen) {
                item.classList.add('open');
                a.style.maxHeight = a.scrollHeight + 'px';
                q.setAttribute('aria-expanded', 'true');
            }
        });
    });

    /* -----------------------------------------
       16b. PRODUCT DETAIL PAGE (product.html?id=...)
       ----------------------------------------- */
    function getQueryId() {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('id');
        } catch (e) { return null; }
    }

    function renderRelated(currentId) {
        const grid = document.getElementById('related-grid');
        const section = document.getElementById('product-related');
        if (!grid || !section) return;
        const catalog = window.ELAN_PRODUCTS || allProducts;
        const others = catalog.filter(p => p.id !== currentId).slice(0, 4);
        grid.innerHTML = others.map(p => {
            const price = p.priceDisplay || ('$' + Number(p.price).toFixed(2));
            return `
            <div class="clean-product-card product-card" data-id="${p.id}" data-name="${p.name}">
                ${p.badge ? `<span class="clean-product-badge">${p.badge}</span>` : ''}
                <button class="clean-wishlist-btn wishlist-btn" aria-label="Add ${p.name} to wishlist"><i class="far fa-heart"></i></button>
                <a class="clean-product-link" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="View ${p.name}">
                    <div class="clean-product-image product-image"><img src="${p.image}" alt="${p.name} luxury perfume bottle" loading="lazy"></div>
                    <p class="clean-product-eyebrow">${p.number} — ${p.type}</p>
                    <h3>${p.name}</h3>
                    <p class="clean-product-family">${p.family}</p>
                    <div class="clean-product-price product-price">${price}</div>
                </a>
                <button class="clean-cart-btn cart-btn" aria-label="Add ${p.name} to cart">Add to Cart</button>
            </div>`;
        }).join('');
        section.hidden = false;
        bindAddToCartButtons(grid);
        bindWishlistButtons(grid);
    }

    (function initProductPage() {
        const detail = document.getElementById('product-detail');
        if (!detail) return;
        const id = getQueryId();
        const catalog = window.ELAN_PRODUCTS || allProducts;
        const map = {};
        catalog.forEach(p => { map[String(p.id).toLowerCase()] = p; });
        const product = id ? map[String(id).toLowerCase()] : null;
        const notFound = document.getElementById('product-notfound');

        if (!product) {
            detail.hidden = true;
            if (notFound) notFound.hidden = false;
            document.title = 'Fragrance not found | ÉLAN PARFUMS';
            return;
        }

        document.title = product.name + ' | ÉLAN PARFUMS';
        const crumb = document.getElementById('crumb-name');
        if (crumb) crumb.textContent = product.name;
        detail.hidden = false;

        const badge = document.getElementById('p-badge');
        if (badge) {
            if (product.badge) { badge.textContent = product.badge; badge.hidden = false; }
            else badge.hidden = true;
        }
        const img = document.getElementById('p-image');
        if (img) { img.src = product.image; img.alt = product.name + ' luxury perfume bottle'; }
        const num = document.getElementById('p-number');
        if (num) num.textContent = product.number + ' — ' + product.type;
        const nm = document.getElementById('p-name');
        if (nm) nm.textContent = product.name;
        const fam = document.getElementById('p-family');
        if (fam) fam.textContent = product.family;
        const pr = document.getElementById('p-price');
        if (pr) pr.textContent = product.priceDisplay || ('$' + Number(product.price).toFixed(2));
        const desc = document.getElementById('p-desc');
        if (desc) desc.textContent = product.description || '';
        const long = document.getElementById('p-long');
        if (long) long.textContent = product.longDescription || '';
        const notes = document.getElementById('p-notes');
        if (notes) {
            notes.innerHTML = (product.notes || []).map(n => `<span>${n}</span>`).join('');
        }

        // Gallery thumbnails (real images only)
        const thumbs = document.getElementById('p-thumbs');
        const gallery = (product.gallery && product.gallery.length ? product.gallery : [product.image]).filter(Boolean);
        if (thumbs) {
            thumbs.innerHTML = gallery.map((src, i) =>
                `<button class="${i === 0 ? 'active' : ''}" data-src="${src}" aria-label="View image ${i + 1} of ${product.name}"><img src="${src}" alt=""></button>`
            ).join('');
            thumbs.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', () => {
                    thumbs.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    if (img) { img.src = btn.dataset.src; }
                });
            });
            if (gallery.length < 2) thumbs.style.display = 'none';
        }

        // Quantity
        let qty = 1;
        const qtyVal = document.getElementById('qty-value');
        const qMinus = document.getElementById('qty-minus');
        const qPlus = document.getElementById('qty-plus');
        const setQty = (v) => { qty = Math.max(1, Math.min(9, v)); if (qtyVal) qtyVal.textContent = qty; };
        if (qMinus && !qMinus.dataset.bound) { qMinus.dataset.bound = 'true'; qMinus.addEventListener('click', () => setQty(qty - 1)); }
        if (qPlus && !qPlus.dataset.bound) { qPlus.dataset.bound = 'true'; qPlus.addEventListener('click', () => setQty(qty + 1)); }

        // Add to cart (exact product + qty, no duplicate binding)
        const addBtn = document.getElementById('p-add');
        if (addBtn && !addBtn.dataset.bound) {
            addBtn.dataset.bound = 'true';
            addBtn.addEventListener('click', () => {
                addToCart(product.name, product.priceDisplay || ('$' + Number(product.price).toFixed(2)), product.image, qty);
                openCart();
                showToast('Added to cart — ' + product.name);
            });
        }

        // Wishlist (both buttons stay in sync)
        const wishBtn = document.getElementById('p-wish');
        const wishText = document.getElementById('p-wish-text');
        const syncWish = () => {
            const on = wishlist.includes(product.name);
            [wishBtn, wishText].forEach(b => {
                if (!b) return;
                b.classList.toggle('active', on);
                const ic = b.querySelector('i');
                if (ic) { ic.classList.toggle('far', !on); ic.classList.toggle('fas', on); }
            });
            if (wishText) {
                const label = wishText.childNodes[wishText.childNodes.length - 1];
                wishText.innerHTML = `<i class="${on ? 'fas' : 'far'} fa-heart"></i> ${on ? 'SAVED TO WISHLIST' : 'ADD TO WISHLIST'}`;
            }
        };
        syncWish();
        [wishBtn, wishText].forEach(b => {
            if (b && !b.dataset.bound) {
                b.dataset.bound = 'true';
                b.addEventListener('click', (e) => { e.preventDefault(); toggleWishlist(product.name); syncWish(); });
            }
        });

        renderRelated(product.id);
    })();

    /* -----------------------------------------
       17. ESC KEY closes overlays
       ----------------------------------------- */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { closeCart(); closeSearch(); }
    });

});

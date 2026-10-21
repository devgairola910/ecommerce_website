// ==========================================================================
// VØID // ATELIER - APPLICATION CONTROLLER & UI ENGINE
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    selectedCategory: "all",
    selectedSize: "all",
    maxPrice: 400,
    sortBy: "featured",
    searchQuery: "",
    viewCols: 4,
    currentStep: 1,
    checkoutShippingMethod: "standard",
    checkoutData: {
      fullName: "",
      email: "",
      address: "",
      city: "",
      country: "United States",
      postalCode: "",
      cardNumber: "",
      cardExpiry: "",
      cardCvc: ""
    }
  };

  // DOM Elements Cache
  const elements = {
    // Header & Badges
    cartCountBadge: document.getElementById("cartCountBadge"),
    wishlistCountBadge: document.getElementById("wishlistCountBadge"),
    currencySelect: document.getElementById("currencySelect"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),

    // Catalog & Filters
    productGrid: document.getElementById("productGrid"),
    categoryPills: document.querySelectorAll(".category-pill"),
    sizeChips: document.querySelectorAll(".size-chip"),
    priceRangeInput: document.getElementById("priceRangeInput"),
    priceRangeDisplay: document.getElementById("priceRangeDisplay"),
    sortSelect: document.getElementById("sortSelect"),
    activeFilterTags: document.getElementById("activeFilterTags"),
    gridCol3Btn: document.getElementById("gridCol3Btn"),
    gridCol4Btn: document.getElementById("gridCol4Btn"),

    // Hotspots
    lookbookContainer: document.getElementById("lookbookContainer"),

    // Drawers & Overlays
    drawerOverlay: document.getElementById("drawerOverlay"),
    cartDrawer: document.getElementById("cartDrawer"),
    cartItemsList: document.getElementById("cartItemsList"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartDiscountRow: document.getElementById("cartDiscountRow"),
    cartDiscount: document.getElementById("cartDiscount"),
    cartShipping: document.getElementById("cartShipping"),
    cartTotal: document.getElementById("cartTotal"),
    shippingMsgText: document.getElementById("shippingMsgText"),
    shippingProgressBar: document.getElementById("shippingProgressBar"),
    promoCodeInput: document.getElementById("promoCodeInput"),
    applyPromoBtn: document.getElementById("applyPromoBtn"),
    activePromoDisplay: document.getElementById("activePromoDisplay"),
    openCartBtn: document.getElementById("openCartBtn"),
    closeCartBtn: document.getElementById("closeCartBtn"),
    checkoutBtn: document.getElementById("checkoutBtn"),

    // Wishlist Drawer
    wishlistDrawer: document.getElementById("wishlistDrawer"),
    wishlistItemsList: document.getElementById("wishlistItemsList"),
    openWishlistBtn: document.getElementById("openWishlistBtn"),
    closeWishlistBtn: document.getElementById("closeWishlistBtn"),

    // Modals
    quickviewBackdrop: document.getElementById("quickviewBackdrop"),
    closeQuickviewBtn: document.getElementById("closeQuickviewBtn"),
    quickviewContent: document.getElementById("quickviewContent"),

    checkoutBackdrop: document.getElementById("checkoutBackdrop"),
    closeCheckoutBtn: document.getElementById("closeCheckoutBtn"),

    searchBackdrop: document.getElementById("searchBackdrop"),
    openSearchBtn: document.getElementById("openSearchBtn"),
    closeSearchBtn: document.getElementById("closeSearchBtn"),
    searchInput: document.getElementById("searchInput"),
    searchResults: document.getElementById("searchResults"),

    // Toast Container
    toastContainer: document.getElementById("toastContainer")
  };

  // ==========================================================================
  // INITIALIZATION
  // ==========================================================================
  function init() {
    renderLookbookHotspots();
    renderProducts();
    updateCartUI();
    updateWishlistUI();
    bindEvents();
    setupTheme();

    // Set initial currency in select
    if (elements.currencySelect) {
      elements.currencySelect.value = store.currentCurrency;
    }
  }

  // ==========================================================================
  // LOOKBOOK HOTSPOTS
  // ==========================================================================
  function renderLookbookHotspots() {
    if (!elements.lookbookContainer) return;

    // Filter products that have hotspot coordinates
    const taggedProducts = PRODUCTS.filter(p => p.hotspot);

    taggedProducts.forEach(prod => {
      const pin = document.createElement("div");
      pin.className = "lookbook-hotspot";
      pin.style.left = `${prod.hotspot.x}%`;
      pin.style.top = `${prod.hotspot.y}%`;

      pin.innerHTML = `
        <button class="hotspot-trigger" title="${prod.name}" aria-label="Tag: ${prod.name}">
          <span>+</span>
        </button>
        <div class="hotspot-popover">
          <img src="${prod.image}" alt="${prod.name}" class="popover-thumb" loading="lazy">
          <div class="popover-title">${prod.name}</div>
          <div class="popover-price">${store.formatPrice(prod.price)}</div>
          <button class="popover-btn" data-id="${prod.id}">Inspect Piece</button>
        </div>
      `;

      pin.querySelector(".popover-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openQuickView(prod.id);
      });

      pin.querySelector(".hotspot-trigger").addEventListener("click", (e) => {
        e.stopPropagation();
        // Toggle mobile click pin
        pin.classList.toggle("active");
      });

      elements.lookbookContainer.appendChild(pin);
    });
  }

  // ==========================================================================
  // CATALOG RENDERING & FILTERING
  // ==========================================================================
  function getFilteredProducts() {
    return PRODUCTS.filter(prod => {
      // Category Filter
      if (state.selectedCategory !== "all" && prod.category !== state.selectedCategory) {
        return false;
      }
      // Size Filter
      if (state.selectedSize !== "all" && !prod.sizes.includes(state.selectedSize) && !prod.sizes.includes("One Size")) {
        return false;
      }
      // Price Filter
      if (prod.price > state.maxPrice) {
        return false;
      }
      // Search Filter
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesDesc = prod.description.toLowerCase().includes(query);
        const matchesCat = prod.categoryLabel.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === "price-low") return a.price - b.price;
      if (state.sortBy === "price-high") return b.price - a.price;
      if (state.sortBy === "rating") return b.rating - a.rating;
      if (state.sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // default featured
    });
  }

  function renderProducts() {
    if (!elements.productGrid) return;

    const filtered = getFilteredProducts();
    updateActiveFilterBadges();

    if (filtered.length === 0) {
      elements.productGrid.innerHTML = `
        <div class="catalog-empty">
          <h3>No garments match your active filters</h3>
          <p>Try resetting filters or adjusting the price threshold.</p>
          <button class="btn btn-outline" id="resetCatalogFiltersBtn">Reset All Filters</button>
        </div>
      `;
      document.getElementById("resetCatalogFiltersBtn")?.addEventListener("click", resetFilters);
      return;
    }

    elements.productGrid.innerHTML = filtered.map(prod => {
      const isWishlisted = store.isInWishlist(prod.id);
      const formattedPrice = store.formatPrice(prod.price);
      const formattedCompare = prod.comparePrice ? store.formatPrice(prod.comparePrice) : null;

      // Quick size buttons
      const sizeButtons = prod.sizes.map(size => `
        <button class="quick-size-btn" data-id="${prod.id}" data-size="${size}" title="Quick Add Size ${size}">${size}</button>
      `).join("");

      return `
        <article class="product-card" data-id="${prod.id}">
          <div class="card-media-wrapper">
            <img src="${prod.image}" alt="${prod.name}" class="product-card-img" loading="lazy">
            <span class="product-badge ${prod.isNew ? 'highlight' : ''}">${prod.badge}</span>
            <button class="wishlist-toggle-btn ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" title="${isWishlisted ? 'Remove from saved' : 'Save to wishlist'}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <div class="card-quick-actions">
              <span class="quick-size-selector-label">Instant Size Select</span>
              <div class="quick-sizes-bar">
                ${sizeButtons}
              </div>
              <button class="card-quick-view-btn" data-id="${prod.id}">Quick View Details</button>
            </div>
          </div>
          <div class="card-info">
            <div class="card-category">${prod.categoryLabel}</div>
            <h3 class="card-title">${prod.name}</h3>
            <div class="card-meta">
              <div class="card-prices">
                <span class="current-price">${formattedPrice}</span>
                ${formattedCompare ? `<span class="compare-price">${formattedCompare}</span>` : ''}
              </div>
              <div class="rating-pill">
                <span class="rating-star">★</span>
                <span>${prod.rating}</span>
                <span style="opacity:0.6;">(${prod.reviewsCount})</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");

    attachProductCardListeners();
  }

  function attachProductCardListeners() {
    // Quick Add Buttons
    elements.productGrid.querySelectorAll(".quick-size-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const size = btn.dataset.size;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          store.addToCart(id, size, prod.colors[0]?.name || "Standard", 1);
          showToast(`Added ${prod.name} (Size ${size}) to your bag`, "bag");
          bumpBadge(elements.cartCountBadge);
        }
      });
    });

    // Wishlist Toggle
    elements.productGrid.querySelectorAll(".wishlist-toggle-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const added = store.toggleWishlist(id);
        const prod = PRODUCTS.find(p => p.id === id);
        btn.classList.toggle("active", added);
        const iconSvg = btn.querySelector("svg");
        if (iconSvg) iconSvg.setAttribute("fill", added ? "currentColor" : "none");
        showToast(added ? `Saved ${prod?.name || 'piece'} to wishlist` : `Removed from wishlist`, "heart");
      });
    });

    // Quick View
    elements.productGrid.querySelectorAll(".card-quick-view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openQuickView(btn.dataset.id);
      });
    });

    // Card Click open quick view
    elements.productGrid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          openQuickView(card.dataset.id);
        }
      });
    });
  }

  function updateActiveFilterBadges() {
    if (!elements.activeFilterTags) return;

    let badges = [];
    if (state.selectedCategory !== "all") {
      badges.push(`Category: ${state.selectedCategory.toUpperCase()}`);
    }
    if (state.selectedSize !== "all") {
      badges.push(`Size: ${state.selectedSize}`);
    }
    if (state.maxPrice < 400) {
      badges.push(`Max: ${store.formatPrice(state.maxPrice)}`);
    }

    if (badges.length > 0) {
      elements.activeFilterTags.innerHTML = `
        ${badges.map(b => `<span class="active-filter-badge">${b}</span>`).join("")}
        <button class="clear-all-filters-btn" id="clearAllFiltersBtn">Clear filters</button>
      `;
      document.getElementById("clearAllFiltersBtn")?.addEventListener("click", resetFilters);
    } else {
      elements.activeFilterTags.innerHTML = "";
    }
  }

  function resetFilters() {
    state.selectedCategory = "all";
    state.selectedSize = "all";
    state.maxPrice = 400;
    state.sortBy = "featured";

    elements.categoryPills.forEach(p => p.classList.toggle("active", p.dataset.category === "all"));
    elements.sizeChips.forEach(c => c.classList.toggle("active", c.dataset.size === "all"));
    if (elements.priceRangeInput) elements.priceRangeInput.value = 400;
    if (elements.priceRangeDisplay) elements.priceRangeDisplay.textContent = store.formatPrice(400);
    if (elements.sortSelect) elements.sortSelect.value = "featured";

    renderProducts();
  }

  // ==========================================================================
  // QUICK VIEW MODAL
  // ==========================================================================
  function openQuickView(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    let selectedSize = prod.sizes[0];
    let selectedColor = prod.colors[0]?.name || "Standard";
    let selectedQty = 1;

    elements.quickviewContent.innerHTML = `
      <div class="quickview-gallery">
        <img src="${prod.image}" alt="${prod.name}" class="quickview-main-img">
      </div>
      <div class="quickview-details">
        <div class="quickview-badge-row">
          <span class="product-badge highlight">${prod.badge}</span>
          <span class="stock-indicator-pill">● In Stock (${prod.stockCount} Available)</span>
        </div>
        <h2 class="quickview-title">${prod.name}</h2>
        <div class="quickview-price-rating">
          <div class="quickview-price">${store.formatPrice(prod.price)}</div>
          <div class="rating-pill">
            <span class="rating-star">★</span>
            <strong>${prod.rating}</strong>
            <span style="opacity:0.6;">(${prod.reviewsCount} verified reviews)</span>
          </div>
        </div>
        <p class="quickview-description">${prod.description}</p>

        <!-- Color Selection -->
        <div class="quickview-colors-wrap">
          <div class="selector-label">
            <span>Color Palette: <strong>${selectedColor}</strong></span>
          </div>
          <div class="color-swatches">
            ${prod.colors.map((c, idx) => `
              <button class="color-swatch-btn ${idx === 0 ? 'active' : ''}" style="background-color: ${c.hex};" data-color="${c.name}" title="${c.name}"></button>
            `).join("")}
          </div>
        </div>

        <!-- Size Selection -->
        <div class="quickview-sizes-wrap">
          <div class="selector-label">
            <span>Garment Size</span>
            <span class="size-guide-trigger" id="qvSizeGuideTrigger">Sizing Reference</span>
          </div>
          <div class="size-selector-grid">
            ${prod.sizes.map((s, idx) => `
              <button class="modal-size-btn ${idx === 0 ? 'active' : ''}" data-size="${s}">${s}</button>
            `).join("")}
          </div>
        </div>

        <!-- Garment Specifications -->
        <ul class="spec-list">
          ${prod.details.map(d => `<li>• ${d}</li>`).join("")}
        </ul>

        <!-- Action Row -->
        <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
          <div class="qty-controls" style="margin: 0;">
            <button class="qty-btn" id="qvQtyMinus">-</button>
            <span class="qty-display" id="qvQtyVal">1</span>
            <button class="qty-btn" id="qvQtyPlus">+</button>
          </div>
          <button class="btn btn-primary" id="qvAddToCartBtn" style="flex: 1;">
            Add To Bag — ${store.formatPrice(prod.price)}
          </button>
        </div>
      </div>
    `;

    // Bind Quickview actions
    const modal = elements.quickviewContent;

    // Color Swatches
    modal.querySelectorAll(".color-swatch-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modal.querySelectorAll(".color-swatch-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedColor = btn.dataset.color;
        modal.querySelector(".quickview-colors-wrap strong").textContent = selectedColor;
      });
    });

    // Size Buttons
    modal.querySelectorAll(".modal-size-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        modal.querySelectorAll(".modal-size-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
      });
    });

    // Quantity
    const qtyMinus = modal.querySelector("#qvQtyMinus");
    const qtyPlus = modal.querySelector("#qvQtyPlus");
    const qtyVal = modal.querySelector("#qvQtyVal");
    const addToCartBtn = modal.querySelector("#qvAddToCartBtn");

    qtyMinus.addEventListener("click", () => {
      if (selectedQty > 1) {
        selectedQty--;
        qtyVal.textContent = selectedQty;
        addToCartBtn.textContent = `Add To Bag — ${store.formatPrice(prod.price * selectedQty)}`;
      }
    });

    qtyPlus.addEventListener("click", () => {
      selectedQty++;
      qtyVal.textContent = selectedQty;
      addToCartBtn.textContent = `Add To Bag — ${store.formatPrice(prod.price * selectedQty)}`;
    });

    // Add to cart click
    addToCartBtn.addEventListener("click", () => {
      store.addToCart(prod.id, selectedSize, selectedColor, selectedQty);
      closeModal(elements.quickviewBackdrop);
      openDrawer(elements.cartDrawer);
      showToast(`Added ${prod.name} (${selectedSize}) to bag`, "bag");
      bumpBadge(elements.cartCountBadge);
    });

    // Size guide trigger toast
    modal.querySelector("#qvSizeGuideTrigger").addEventListener("click", () => {
      showToast(`${prod.fit}`, "info");
    });

    openModal(elements.quickviewBackdrop);
  }

  // ==========================================================================
  // CART DRAWER & LOGIC
  // ==========================================================================
  function updateCartUI() {
    const totals = store.getTotals();

    // Update Header Badge
    if (elements.cartCountBadge) {
      elements.cartCountBadge.textContent = totals.totalItems;
      elements.cartCountBadge.style.display = totals.totalItems > 0 ? "flex" : "none";
    }

    // Shipping Progress
    if (elements.shippingProgressBar && elements.shippingMsgText) {
      elements.shippingProgressBar.style.width = `${totals.freeShippingProgress}%`;
      if (totals.qualifiesForFreeShipping) {
        elements.shippingMsgText.innerHTML = `<span>Global Express Shipping Unlocked!</span> <strong>FREE</strong>`;
      } else {
        const remainingFormatted = store.formatPrice(totals.amountNeededForFreeShippingUSD);
        elements.shippingMsgText.innerHTML = `<span>Add <strong>${remainingFormatted}</strong> more for Free Shipping</span> <span>${totals.freeShippingProgress}%</span>`;
      }
    }

    // Summary Totals
    if (elements.cartSubtotal) elements.cartSubtotal.textContent = store.formatPrice(totals.subtotalUSD);
    if (elements.cartShipping) {
      elements.cartShipping.textContent = totals.shippingUSD === 0 ? "FREE" : store.formatPrice(totals.shippingUSD);
    }
    if (elements.cartTotal) elements.cartTotal.textContent = store.formatPrice(totals.totalUSD);

    // Discount row
    if (elements.cartDiscountRow && elements.cartDiscount) {
      if (totals.discountUSD > 0) {
        elements.cartDiscountRow.style.display = "flex";
        elements.cartDiscount.textContent = `-${store.formatPrice(totals.discountUSD)}`;
      } else {
        elements.cartDiscountRow.style.display = "none";
      }
    }

    // Promo display
    if (elements.activePromoDisplay) {
      if (store.appliedPromo) {
        elements.activePromoDisplay.style.display = "flex";
        elements.activePromoDisplay.innerHTML = `
          <span>🏷️ ${store.appliedPromo.label}</span>
          <button id="removePromoBtn" style="color: var(--danger); font-weight:700;">✕</button>
        `;
        document.getElementById("removePromoBtn")?.addEventListener("click", () => {
          store.removePromoCode();
          showToast("Promo code removed", "info");
        });
      } else {
        elements.activePromoDisplay.style.display = "none";
      }
    }

    // Cart Items List
    if (!elements.cartItemsList) return;

    if (store.cart.length === 0) {
      elements.cartItemsList.innerHTML = `
        <div class="cart-empty-view">
          <div class="empty-icon">🛍️</div>
          <div class="display-title" style="font-size:1.1rem;">Your Bag is Empty</div>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Discover pieces from Drop 04 and add them to your archive.</p>
          <button class="btn btn-primary" id="exploreDropsBtn">Shop The Drop</button>
        </div>
      `;
      document.getElementById("exploreDropsBtn")?.addEventListener("click", () => {
        closeDrawer(elements.cartDrawer);
      });
      if (elements.checkoutBtn) elements.checkoutBtn.disabled = true;
      return;
    }

    if (elements.checkoutBtn) elements.checkoutBtn.disabled = false;

    elements.cartItemsList.innerHTML = store.cart.map((item, index) => {
      const prod = PRODUCTS.find(p => p.id === item.productId);
      if (!prod) return '';

      const lineTotal = store.formatPrice(prod.price * item.quantity);

      return `
        <div class="cart-item">
          <img src="${prod.image}" alt="${prod.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${prod.name}</h4>
            <div class="cart-item-specs">SIZE: ${item.size} // ${item.color}</div>
            <div class="cart-item-price">${lineTotal}</div>
            <div class="qty-controls">
              <button class="qty-btn" data-action="decrease" data-index="${index}">-</button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
            </div>
          </div>
          <button class="cart-item-remove-btn" data-action="remove" data-index="${index}" title="Remove item">✕</button>
        </div>
      `;
    }).join("");

    // Cart Item Action Listeners
    elements.cartItemsList.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        const action = btn.dataset.action;
        const currentQty = store.cart[idx]?.quantity || 1;
        if (action === "increase") {
          store.updateQuantity(idx, currentQty + 1);
        } else if (action === "decrease") {
          store.updateQuantity(idx, currentQty - 1);
        }
      });
    });

    elements.cartItemsList.querySelectorAll(".cart-item-remove-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        store.removeFromCart(idx);
        showToast("Garment removed from bag", "info");
      });
    });
  }

  // ==========================================================================
  // WISHLIST DRAWER & LOGIC
  // ==========================================================================
  function updateWishlistUI() {
    if (elements.wishlistCountBadge) {
      elements.wishlistCountBadge.textContent = store.wishlist.length;
      elements.wishlistCountBadge.style.display = store.wishlist.length > 0 ? "flex" : "none";
    }

    if (!elements.wishlistItemsList) return;

    if (store.wishlist.length === 0) {
      elements.wishlistItemsList.innerHTML = `
        <div class="cart-empty-view">
          <div class="empty-icon">♡</div>
          <div class="display-title" style="font-size:1.1rem;">No Saved Garments</div>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Tap the heart icon on any product to save it to your personal lookbook.</p>
        </div>
      `;
      return;
    }

    elements.wishlistItemsList.innerHTML = store.wishlist.map(id => {
      const prod = PRODUCTS.find(p => p.id === id);
      if (!prod) return '';

      return `
        <div class="wishlist-item">
          <img src="${prod.image}" alt="${prod.name}" class="wishlist-item-thumb">
          <div>
            <div style="font-size:0.85rem; font-weight:700;">${prod.name}</div>
            <div style="font-family:var(--font-mono); font-size:0.8rem; color:var(--accent-acid);">${store.formatPrice(prod.price)}</div>
            <button class="btn btn-outline" style="padding:0.35rem 0.65rem; font-size:0.68rem; margin-top:0.4rem;" data-id="${prod.id}" data-action="move-to-cart">
              Move to Bag
            </button>
          </div>
          <button class="cart-item-remove-btn" data-id="${prod.id}" data-action="remove-wishlist">✕</button>
        </div>
      `;
    }).join("");

    elements.wishlistItemsList.querySelectorAll("[data-action='move-to-cart']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const prod = PRODUCTS.find(p => p.id === id);
        if (prod) {
          store.addToCart(id, prod.sizes[0], prod.colors[0]?.name || "Standard", 1);
          store.toggleWishlist(id);
          showToast(`Moved ${prod.name} to bag`, "bag");
          bumpBadge(elements.cartCountBadge);
        }
      });
    });

    elements.wishlistItemsList.querySelectorAll("[data-action='remove-wishlist']").forEach(btn => {
      btn.addEventListener("click", () => {
        store.toggleWishlist(btn.dataset.id);
        renderProducts(); // update heart icons on catalog
        showToast("Removed from wishlist", "info");
      });
    });
  }

  // ==========================================================================
  // MULTI-STEP CHECKOUT SYSTEM
  // ==========================================================================
  function openCheckout() {
    closeDrawer(elements.cartDrawer);
    state.currentStep = 1;
    renderCheckoutStep();
    openModal(elements.checkoutBackdrop);
  }

  function renderCheckoutStep() {
    const container = document.getElementById("checkoutStepContainer");
    const totals = store.getTotals();
    const formattedTotal = store.formatPrice(totals.totalUSD);

    // Update step indicator classes
    [1, 2, 3, 4].forEach(stepNum => {
      const stepEl = document.getElementById(`step-indicator-${stepNum}`);
      if (!stepEl) return;
      stepEl.classList.remove("active", "completed");
      if (stepNum === state.currentStep) stepEl.classList.add("active");
      if (stepNum < state.currentStep) stepEl.classList.add("completed");
    });

    if (state.currentStep === 1) {
      // Step 1: Customer Info & Shipping Address
      container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3 class="display-title" style="font-size:1.25rem;">01 // Shipping Destination</h3>
          <button class="autofill-demo-btn" id="autofillDemoBtn">⚡ Fill Demo Address</button>
        </div>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">Enter delivery coordinates for secure express courier dispatch.</p>

        <form id="checkoutStep1Form">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="coName" required placeholder="Alexander Vance" value="${state.checkoutData.fullName}">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="coEmail" required placeholder="alexander@atelier-void.com" value="${state.checkoutData.email}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Street Address</label>
            <input type="text" class="form-input" id="coAddress" required placeholder="742 Shibuya Crossing, Apt 402" value="${state.checkoutData.address}">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">City / Region</label>
              <input type="text" class="form-input" id="coCity" required placeholder="Tokyo / Shibuya" value="${state.checkoutData.city}">
            </div>
            <div class="form-group">
              <label class="form-label">Postal Code</label>
              <input type="text" class="form-input" id="coPostal" required placeholder="150-0002" value="${state.checkoutData.postalCode}">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; margin-top:1.5rem;">
            Continue To Delivery Options →
          </button>
        </form>
      `;

      // Autofill demo button
      document.getElementById("autofillDemoBtn")?.addEventListener("click", () => {
        document.getElementById("coName").value = "Devashish Gairola";
        document.getElementById("coEmail").value = "devashish@example.com";
        document.getElementById("coAddress").value = "45 Mercer Street, SoHo Loft 4B";
        document.getElementById("coCity").value = "New York, NY";
        document.getElementById("coPostal").value = "10013";
        showToast("Demo address autofilled", "info");
      });

      document.getElementById("checkoutStep1Form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        state.checkoutData.fullName = document.getElementById("coName").value;
        state.checkoutData.email = document.getElementById("coEmail").value;
        state.checkoutData.address = document.getElementById("coAddress").value;
        state.checkoutData.city = document.getElementById("coCity").value;
        state.checkoutData.postalCode = document.getElementById("coPostal").value;
        state.currentStep = 2;
        renderCheckoutStep();
      });
    } else if (state.currentStep === 2) {
      // Step 2: Shipping Method
      container.innerHTML = `
        <h3 class="display-title" style="font-size:1.25rem;">02 // Select Dispatch Speed</h3>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">All packages are sealed in carbon-neutral tamperproof vacuum crates.</p>

        <div class="shipping-method-option ${state.checkoutShippingMethod === 'standard' ? 'selected' : ''}" data-method="standard">
          <div>
            <div style="font-weight:700; font-size:0.88rem;">Standard Global Tracked</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Estimated Delivery: 4-6 Business Days</div>
          </div>
          <div style="font-family:var(--font-mono); font-weight:700;">${totals.shippingUSD === 0 ? 'FREE' : store.formatPrice(totals.shippingUSD)}</div>
        </div>

        <div class="shipping-method-option ${state.checkoutShippingMethod === 'express' ? 'selected' : ''}" data-method="express">
          <div>
            <div style="font-weight:700; font-size:0.88rem;">DHL Express Armored Priority</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">Estimated Delivery: 24-48 Hours Worldwide</div>
          </div>
          <div style="font-family:var(--font-mono); font-weight:700;">${store.formatPrice(35)}</div>
        </div>

        <div style="display:flex; gap:1rem; margin-top:2rem;">
          <button class="btn btn-outline" id="coBackStep1">← Back</button>
          <button class="btn btn-primary" id="coGoStep3" style="flex:1;">Proceed to Payment (${formattedTotal}) →</button>
        </div>
      `;

      container.querySelectorAll(".shipping-method-option").forEach(opt => {
        opt.addEventListener("click", () => {
          container.querySelectorAll(".shipping-method-option").forEach(o => o.classList.remove("selected"));
          opt.classList.add("selected");
          state.checkoutShippingMethod = opt.dataset.method;
        });
      });

      document.getElementById("coBackStep1")?.addEventListener("click", () => {
        state.currentStep = 1;
        renderCheckoutStep();
      });

      document.getElementById("coGoStep3")?.addEventListener("click", () => {
        state.currentStep = 3;
        renderCheckoutStep();
      });
    } else if (state.currentStep === 3) {
      // Step 3: Payment
      container.innerHTML = `
        <h3 class="display-title" style="font-size:1.25rem;">03 // Payment Authorization</h3>
        <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.25rem;">End-to-end 256-bit encrypted checkout. Simulated sandbox active.</p>

        <!-- Simulated Card Graphic -->
        <div class="card-simulator">
          <div class="card-sim-chip"></div>
          <div class="card-sim-number" id="cardSimDisplay">•••• •••• •••• 4242</div>
          <div class="card-sim-footer">
            <div>CARDHOLDER: <span id="cardHolderDisplay">${state.checkoutData.fullName || 'VØID CLIENT'}</span></div>
            <div>EXP: <span id="cardExpDisplay">12/28</span></div>
          </div>
        </div>

        <form id="checkoutPaymentForm">
          <div class="form-group">
            <label class="form-label">Card Number</label>
            <input type="text" class="form-input" id="coCardNum" required maxlength="19" placeholder="4242 •••• •••• 4242" value="4242 8820 9104 4242">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Expiry (MM/YY)</label>
              <input type="text" class="form-input" id="coCardExp" required maxlength="5" placeholder="10/28" value="10/28">
            </div>
            <div class="form-group">
              <label class="form-label">Security CVC</label>
              <input type="text" class="form-input" id="coCardCvc" required maxlength="4" placeholder="888" value="888">
            </div>
          </div>

          <div style="display:flex; gap:1rem; margin-top:1.5rem;">
            <button type="button" class="btn btn-outline" id="coBackStep2">← Back</button>
            <button type="submit" class="btn btn-primary" style="flex:1;">
              Authorize & Place Order (${formattedTotal})
            </button>
          </div>
        </form>
      `;

      // Live card formatter
      const cardNumInput = document.getElementById("coCardNum");
      const cardSimDisplay = document.getElementById("cardSimDisplay");
      cardNumInput?.addEventListener("input", (e) => {
        let val = e.target.value.replace(/\D/g, "").substring(0, 16);
        val = val != "" ? val.match(/.{1,4}/g).join(" ") : "";
        e.target.value = val;
        cardSimDisplay.textContent = val || "•••• •••• •••• 4242";
      });

      document.getElementById("coBackStep2")?.addEventListener("click", () => {
        state.currentStep = 2;
        renderCheckoutStep();
      });

      document.getElementById("checkoutPaymentForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        state.currentStep = 4;
        renderCheckoutStep();
      });
    } else if (state.currentStep === 4) {
      // Step 4: Order Confirmed
      const orderId = `VD-${Math.floor(100000 + Math.random() * 900000)}`;
      const itemsPurchased = [...store.cart];
      const orderTotal = formattedTotal;

      container.innerHTML = `
        <div class="order-confirmation-wrap">
          <div class="confirmation-check-circle">✓</div>
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-acid); letter-spacing:0.15em;">PAYMENT CONFIRMED // DISPATCH SCHEDULED</span>
          <h2 class="display-title" style="font-size:2rem; margin:0.5rem 0 1rem;">Order #${orderId}</h2>
          <p style="color:var(--text-secondary); font-size:0.85rem; max-width:440px; margin:0 auto;">
            Thank you, <strong>${state.checkoutData.fullName || 'Valued Client'}</strong>. An itemized atelier manifest has been transmitted to <strong>${state.checkoutData.email || 'your email'}</strong>.
          </p>

          <div class="order-receipt-summary">
            <div style="font-size:0.75rem; font-family:var(--font-mono); text-transform:uppercase; color:var(--text-muted); margin-bottom:1rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.5rem;">
              Manifest Breakdown
            </div>
            ${itemsPurchased.map(item => {
              const p = PRODUCTS.find(pr => pr.id === item.productId);
              return `
                <div style="display:flex; justify-content:space-between; font-size:0.82rem; margin-bottom:0.5rem;">
                  <span>${p?.name || 'Garment'} (${item.size}) x${item.quantity}</span>
                  <span style="font-family:var(--font-mono); font-weight:700;">${store.formatPrice(p?.price * item.quantity)}</span>
                </div>
              `;
            }).join("")}
            <div style="display:flex; justify-content:space-between; font-size:0.95rem; font-weight:800; border-top:1px solid var(--border-medium); padding-top:0.75rem; margin-top:0.75rem;">
              <span>Total Settled</span>
              <span style="font-family:var(--font-mono); color:var(--accent-acid);">${orderTotal}</span>
            </div>
          </div>

          <div style="display:flex; gap:1rem; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-outline" id="printReceiptBtn">🖨️ Print Manifest</button>
            <button class="btn btn-primary" id="finishShoppingBtn">Return to Drops</button>
          </div>
        </div>
      `;

      // Clear the cart on successful order
      store.clearCart();

      document.getElementById("printReceiptBtn")?.addEventListener("click", () => {
        window.print();
      });

      document.getElementById("finishShoppingBtn")?.addEventListener("click", () => {
        closeModal(elements.checkoutBackdrop);
      });
    }
  }

  // ==========================================================================
  // SEARCH OVERLAY MODAL
  // ==========================================================================
  function handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    if (!elements.searchResults) return;

    if (!query) {
      elements.searchResults.innerHTML = `
        <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          Type keywords like "Hoodie", "Cargo", "Gore-Tex", or "Runner"...
        </div>
      `;
      return;
    }

    const matches = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.categoryLabel.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      elements.searchResults.innerHTML = `
        <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          No garments found matching "${query}"
        </div>
      `;
      return;
    }

    elements.searchResults.innerHTML = matches.map(prod => `
      <div class="search-result-item" data-id="${prod.id}">
        <img src="${prod.image}" alt="${prod.name}" class="search-result-thumb">
        <div style="flex:1;">
          <div style="font-size:0.85rem; font-weight:700;">${prod.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">${prod.categoryLabel}</div>
        </div>
        <div style="font-family:var(--font-mono); font-size:0.85rem; font-weight:700; color:var(--accent-acid);">
          ${store.formatPrice(prod.price)}
        </div>
      </div>
    `).join("");

    elements.searchResults.querySelectorAll(".search-result-item").forEach(item => {
      item.addEventListener("click", () => {
        closeModal(elements.searchBackdrop);
        openQuickView(item.dataset.id);
      });
    });
  }

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  function showToast(message, type = "info") {
    if (!elements.toastContainer) return;

    const iconMap = {
      bag: "🛍️",
      heart: "♡",
      check: "✓",
      info: "ℹ"
    };

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span class="toast-icon">${iconMap[type] || "ℹ"}</span>
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-hide");
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }

  function bumpBadge(badgeEl) {
    if (!badgeEl) return;
    badgeEl.classList.remove("bump");
    void badgeEl.offsetWidth; // trigger reflow
    badgeEl.classList.add("bump");
  }

  // ==========================================================================
  // MODAL & DRAWER HELPERS
  // ==========================================================================
  function openDrawer(drawerEl) {
    if (!drawerEl) return;
    elements.drawerOverlay.classList.add("active");
    drawerEl.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeDrawer(drawerEl) {
    if (!drawerEl) return;
    drawerEl.classList.remove("active");
    elements.drawerOverlay.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  function openModal(modalBackdropEl) {
    if (!modalBackdropEl) return;
    modalBackdropEl.classList.add("active");
    document.body.classList.add("modal-open");
  }

  function closeModal(modalBackdropEl) {
    if (!modalBackdropEl) return;
    modalBackdropEl.classList.remove("active");
    document.body.classList.remove("modal-open");
  }

  // ==========================================================================
  // THEME MANAGEMENT
  // ==========================================================================
  function setupTheme() {
    const savedTheme = localStorage.getItem("void_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    elements.themeToggleBtn?.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("void_theme", next);
      showToast(`Switched to ${next.toUpperCase()} atelier theme`, "info");
    });
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================
  function bindEvents() {
    // Currency Selector
    elements.currencySelect?.addEventListener("change", (e) => {
      store.setCurrency(e.target.value);
      renderProducts();
      updateCartUI();
      showToast(`Currency converted to ${e.target.value}`, "check");
    });

    // Category Filter Pills
    elements.categoryPills.forEach(pill => {
      pill.addEventListener("click", () => {
        elements.categoryPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        state.selectedCategory = pill.dataset.category;
        renderProducts();
      });
    });

    // Size Chips
    elements.sizeChips.forEach(chip => {
      chip.addEventListener("click", () => {
        elements.sizeChips.forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        state.selectedSize = chip.dataset.size;
        renderProducts();
      });
    });

    // Price Range Slider
    elements.priceRangeInput?.addEventListener("input", (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      if (elements.priceRangeDisplay) {
        elements.priceRangeDisplay.textContent = store.formatPrice(state.maxPrice);
      }
      renderProducts();
    });

    // Sort Dropdown
    elements.sortSelect?.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });

    // Grid View Switcher
    elements.gridCol3Btn?.addEventListener("click", () => {
      elements.productGrid.classList.add("col-3");
      elements.gridCol3Btn.classList.add("active");
      elements.gridCol4Btn.classList.remove("active");
    });

    elements.gridCol4Btn?.addEventListener("click", () => {
      elements.productGrid.classList.remove("col-3");
      elements.gridCol4Btn.classList.add("active");
      elements.gridCol3Btn.classList.remove("active");
    });

    // Cart Drawer Open/Close
    elements.openCartBtn?.addEventListener("click", () => openDrawer(elements.cartDrawer));
    elements.closeCartBtn?.addEventListener("click", () => closeDrawer(elements.cartDrawer));
    elements.drawerOverlay?.addEventListener("click", () => {
      closeDrawer(elements.cartDrawer);
      closeDrawer(elements.wishlistDrawer);
    });

    // Wishlist Drawer Open/Close
    elements.openWishlistBtn?.addEventListener("click", () => openDrawer(elements.wishlistDrawer));
    elements.closeWishlistBtn?.addEventListener("click", () => closeDrawer(elements.wishlistDrawer));

    // Promo Code Apply
    elements.applyPromoBtn?.addEventListener("click", () => {
      const code = elements.promoCodeInput.value;
      const res = store.applyPromoCode(code);
      if (res.success) {
        elements.promoCodeInput.value = "";
        showToast(res.message, "check");
      } else {
        showToast(res.message, "info");
      }
    });

    // Checkout Modal
    elements.checkoutBtn?.addEventListener("click", openCheckout);
    elements.closeCheckoutBtn?.addEventListener("click", () => closeModal(elements.checkoutBackdrop));

    // Quickview Modal Close
    elements.closeQuickviewBtn?.addEventListener("click", () => closeModal(elements.quickviewBackdrop));

    // Search Trigger & Shortcut (Cmd+K / Ctrl+K)
    elements.openSearchBtn?.addEventListener("click", () => {
      openModal(elements.searchBackdrop);
      setTimeout(() => elements.searchInput?.focus(), 100);
    });
    elements.closeSearchBtn?.addEventListener("click", () => closeModal(elements.searchBackdrop));
    elements.searchInput?.addEventListener("input", handleSearchInput);

    window.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openModal(elements.searchBackdrop);
        setTimeout(() => elements.searchInput?.focus(), 100);
      }
      if (e.key === "Escape") {
        closeModal(elements.searchBackdrop);
        closeModal(elements.quickviewBackdrop);
        closeModal(elements.checkoutBackdrop);
        closeDrawer(elements.cartDrawer);
        closeDrawer(elements.wishlistDrawer);
      }
    });

    // VIP Newsletter Form
    document.getElementById("vipNewsletterForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("vipEmailInput").value;
      store.applyPromoCode("VOID10");
      showToast(`Welcome ${email}! Promo 'VOID10' unlocked (10% off)`, "check");
      document.getElementById("vipEmailInput").value = "";
    });

    // Global Store Listeners
    window.addEventListener("cart:updated", () => {
      updateCartUI();
    });

    window.addEventListener("wishlist:updated", () => {
      updateWishlistUI();
    });

    window.addEventListener("currency:changed", () => {
      renderProducts();
    });
  }

  // Launch App
  init();
});

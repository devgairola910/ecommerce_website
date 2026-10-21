// VØID // ATELIER - Cart & Store State Engine

const FREE_SHIPPING_THRESHOLD_USD = 150;
const STANDARD_SHIPPING_USD = 20;

class StoreState {
  constructor() {
    this.cart = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.currentCurrency = localStorage.getItem("void_currency") || "USD";
    this.appliedPromo = this.loadPromo();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem("void_cart");
      return saved ? JSON.parse(saved) : [
        // Default sample item for immediate showcase delight
        { productId: "prod-01", size: "L", color: "Vintage Charcoal", quantity: 1 }
      ];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem("void_cart", JSON.stringify(this.cart));
    this.emitEvent("cart:updated");
  }

  loadWishlist() {
    try {
      const saved = localStorage.getItem("void_wishlist");
      return saved ? JSON.parse(saved) : ["prod-03", "prod-04"];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    localStorage.setItem("void_wishlist", JSON.stringify(this.wishlist));
    this.emitEvent("wishlist:updated");
  }

  loadPromo() {
    try {
      const saved = localStorage.getItem("void_promo");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  }

  savePromo(promo) {
    this.appliedPromo = promo;
    if (promo) {
      localStorage.setItem("void_promo", JSON.stringify(promo));
    } else {
      localStorage.removeItem("void_promo");
    }
    this.emitEvent("cart:updated");
  }

  emitEvent(eventName, detail = {}) {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  setCurrency(currencyCode) {
    if (CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode;
      localStorage.setItem("void_currency", currencyCode);
      this.emitEvent("currency:changed", { currency: currencyCode });
      this.emitEvent("cart:updated");
    }
  }

  formatPrice(usdAmount) {
    const config = CURRENCIES[this.currentCurrency] || CURRENCIES.USD;
    const converted = usdAmount * config.rate;
    if (this.currentCurrency === "JPY") {
      return `${config.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${config.symbol}${converted.toFixed(2)}`;
  }

  addToCart(productId, size = null, color = null, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return false;

    const chosenSize = size || product.sizes[0];
    const chosenColor = color || (product.colors[0] ? product.colors[0].name : "Standard");

    const existingIndex = this.cart.findIndex(
      item => item.productId === productId && item.size === chosenSize && item.color === chosenColor
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        productId,
        size: chosenSize,
        color: chosenColor,
        quantity
      });
    }

    this.saveCart();
    return true;
  }

  updateQuantity(index, newQty) {
    if (index >= 0 && index < this.cart.length) {
      if (newQty <= 0) {
        this.cart.splice(index, 1);
      } else {
        this.cart[index].quantity = newQty;
      }
      this.saveCart();
    }
  }

  removeFromCart(index) {
    if (index >= 0 && index < this.cart.length) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      this.wishlist.splice(index, 1);
      added = false;
    } else {
      this.wishlist.push(productId);
      added = true;
    }
    this.saveWishlist();
    return added;
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  applyPromoCode(code) {
    const normalized = (code || "").trim().toUpperCase();
    if (PROMO_CODES[normalized]) {
      this.savePromo({ code: normalized, ...PROMO_CODES[normalized] });
      return { success: true, message: `Promo '${normalized}' applied: ${PROMO_CODES[normalized].label}` };
    }
    return { success: false, message: "Invalid or expired promo code. Try 'VOID10' or 'DROP20'." };
  }

  removePromoCode() {
    this.savePromo(null);
  }

  getTotals() {
    let subtotalUSD = 0;
    let totalItems = 0;

    this.cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (product) {
        subtotalUSD += product.price * item.quantity;
        totalItems += item.quantity;
      }
    });

    let discountUSD = 0;
    let shippingUSD = subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD || subtotalUSD === 0 ? 0 : STANDARD_SHIPPING_USD;

    if (this.appliedPromo) {
      if (this.appliedPromo.type === "percent") {
        discountUSD = (subtotalUSD * this.appliedPromo.value) / 100;
      } else if (this.appliedPromo.type === "shipping") {
        shippingUSD = 0;
      }
    }

    const freeShippingProgress = Math.min(100, Math.round((subtotalUSD / FREE_SHIPPING_THRESHOLD_USD) * 100));
    const amountNeededForFreeShippingUSD = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotalUSD);

    const totalUSD = Math.max(0, subtotalUSD - discountUSD + shippingUSD);

    return {
      subtotalUSD,
      discountUSD,
      shippingUSD,
      totalUSD,
      totalItems,
      freeShippingProgress,
      amountNeededForFreeShippingUSD,
      qualifiesForFreeShipping: subtotalUSD >= FREE_SHIPPING_THRESHOLD_USD
    };
  }
}

// Global store instance
const store = new StoreState();

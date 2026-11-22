import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CartContext } from "./cartStore";

export function CartProvider({ children }) {
  // Load initial cart from localStorage if present
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cosmetic_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // State to control slide-out Cart Drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cosmetic_cart", JSON.stringify(cart));
    } catch (err) {
      console.error("Failed to save cart to localStorage:", err);
    }
  }, [cart]);

  // Add product to cart
  function addToCart(product, quantity = 1) {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.productId === product.productId
      );

      const productImage =
        product.image ||
        (product.images && product.images.length > 0 ? product.images[0] : "") ||
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80";

      if (existingIndex > -1) {
        // Product already in cart, increment quantity
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        // Add new item
        return [
          ...prevCart,
          {
            productId: product.productId,
            name: product.name,
            price: Number(product.price) || 0,
            image: productImage,
            category: product.category || "Cosmetics",
            quantity: quantity,
          },
        ];
      }
    });

    toast.success(
      `Added "${product.name}" to your beauty bag!`,
      {
        icon: "🌸",
        style: {
          borderRadius: "16px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          color: "#be123c",
          border: "1px solid rgba(253, 164, 175, 0.5)",
          boxShadow: "0 10px 30px rgba(244, 63, 94, 0.15)",
          fontWeight: 600,
        },
      }
    );
  }

  // Remove single item completely
  function removeFromCart(productId) {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
    toast("Item removed from beauty bag", { icon: "✨" });
  }

  // Change quantity (+1 or -1)
  function updateQuantity(productId, amount) {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  }

  // Clear entire cart
  function clearCart() {
    setCart([]);
  }

  // Total item count in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Subtotal in dollars/currency
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

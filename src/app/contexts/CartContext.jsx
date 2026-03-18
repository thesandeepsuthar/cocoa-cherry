"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

const initialState = {
  cart: { items: [], totalAmount: 0, totalItems: 0 },
  wishlist: { products: [] },
  isLoading: false,
  isCartOpen: false,
  processingItems: [], // Track which items are being processed
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_CART":
      return { ...state, cart: action.payload, isLoading: false };
    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload, isLoading: false };
    case "CLEAR_CART":
      return { ...state, cart: { items: [], totalAmount: 0, totalItems: 0 } };
    case "CLEAR_WISHLIST":
      return { ...state, wishlist: { products: [] } };
    case "SET_CART_OPEN":
      return { ...state, isCartOpen: action.payload };
    case "SET_ITEM_PROCESSING":
      return {
        ...state,
        processingItems: action.payload.add
          ? [...state.processingItems, action.payload.itemId]
          : state.processingItems.filter((id) => id !== action.payload.itemId),
      };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Load cart and wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
      loadWishlist();
    } else {
      dispatch({ type: "CLEAR_CART" });
      dispatch({ type: "CLEAR_WISHLIST" });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch("/api/cart");
      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data.cart });
      }
    } catch (error) {
      console.error("Load cart failed:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await fetch("/api/wishlist");
      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_WISHLIST", payload: data.data.wishlist });
      }
    } catch (error) {
      console.error("Load wishlist failed:", error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data.cart });
      }

      return data;
    } catch (error) {
      console.error("Add to cart failed:", error);
      return { success: false, message: "Failed to add to cart" };
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: true },
      });

      const response = await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data.cart });
      }

      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: false },
      });
      return data;
    } catch (error) {
      console.error("Update cart failed:", error);
      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: false },
      });
      return { success: false, message: "Failed to update cart" };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: true },
      });

      const response = await fetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data.cart });
      }

      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: false },
      });
      return data;
    } catch (error) {
      console.error("Remove from cart failed:", error);
      dispatch({
        type: "SET_ITEM_PROCESSING",
        payload: { itemId: productId, add: false },
      });
      return { success: false, message: "Failed to remove from cart" };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_WISHLIST", payload: data.data.wishlist });
      }

      return data;
    } catch (error) {
      console.error("Add to wishlist failed:", error);
      return { success: false, message: "Failed to add to wishlist" };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_WISHLIST", payload: data.data.wishlist });
      }

      return data;
    } catch (error) {
      console.error("Remove from wishlist failed:", error);
      return { success: false, message: "Failed to remove from wishlist" };
    }
  };

  const moveToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "SET_CART", payload: data.data.cart });
        dispatch({ type: "SET_WISHLIST", payload: data.data.wishlist });
      }

      return data;
    } catch (error) {
      console.error("Move to cart failed:", error);
      return { success: false, message: "Failed to move to cart" };
    }
  };

  const value = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    loadCart,
    loadWishlist,
    setIsCartOpen: (isOpen) =>
      dispatch({ type: "SET_CART_OPEN", payload: isOpen }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

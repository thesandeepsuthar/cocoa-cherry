"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    updateCartItem,
    removeFromCart,
    isLoading,
    setIsCartOpen,
    processingItems,
  } = useCart();
  const { isAuthenticated, setIsLoginOpen } = useAuth();

  const isItemProcessing = (productId) => processingItems.includes(productId);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1 || isItemProcessing(productId)) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemoveItem = async (productId) => {
    if (isItemProcessing(productId)) return;
    await removeFromCart(productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-noir/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-noir-light border-l border-rose/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-rose/10 flex items-center justify-between glass-strong">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
                  <span className="material-symbols-outlined font-bold">
                    shopping_bag
                  </span>
                </div>
                <div>
                  <h2
                    className="text-xl font-bold text-cream"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Shopping Cart
                  </h2>
                  <p className="text-cream-muted text-xs uppercase tracking-widest">
                    {cart.totalItems} Items Selected
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-cream/5 flex items-center justify-center text-cream-muted hover:text-rose hover:bg-rose/10 transition-all duration-300"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              {!isAuthenticated ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-rose/5 flex items-center justify-center text-rose/30">
                    <span className="material-symbols-outlined text-5xl">
                      lock
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cream">
                      Sign in Required
                    </h3>
                    <p className="text-cream-muted mt-2 max-w-[240px] mx-auto">
                      Please login to save your cart and proceed with checkout
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setIsLoginOpen(true);
                    }}
                    className="btn-primary"
                  >
                    Register / Login
                  </button>
                </div>
              ) : isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-rose border-t-transparent rounded-full animate-spin" />
                </div>
              ) : cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-rose/5 flex items-center justify-center text-rose/30 animate-pulse">
                    <span className="material-symbols-outlined text-5xl">
                      shopping_cart
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-cream">
                      Your cart is empty
                    </h3>
                    <p className="text-cream-muted mt-2">
                      Looks like you haven&apos;t added any treats yet!
                    </p>
                  </div>
                  <Link
                    href="/menu"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    Explore Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.items.map((item) => (
                    <motion.div
                      layout
                      key={item.product._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group p-4 rounded-2xl bg-noir border border-cream/5 hover:border-rose/20 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        {(item.product.images?.[0]?.url ||
                          item.product.imageData) && (
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-cream/10">
                            <img
                              src={
                                item.product.images?.[0]?.url ||
                                item.product.imageData
                              }
                              alt={item.product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-cream font-bold truncate pr-6">
                                {item.product.name}
                              </h3>
                              <button
                                onClick={() =>
                                  handleRemoveItem(item.product._id)
                                }
                                disabled={isItemProcessing(item.product._id)}
                                className="text-cream/20 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  delete_outline
                                </span>
                              </button>
                            </div>
                            <p className="text-rose font-bold mt-1">
                              ₹{item.price}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 bg-noir-light rounded-lg border border-cream/5 p-1">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity - 1,
                                  )
                                }
                                disabled={isItemProcessing(item.product._id)}
                                className="w-8 h-8 rounded-md flex items-center justify-center text-cream/50 hover:text-rose hover:bg-rose/10 transition-all font-bold disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  remove
                                </span>
                              </button>
                              <span className="w-8 text-center text-cream font-bold text-sm flex items-center justify-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    item.product._id,
                                    item.quantity + 1,
                                  )
                                }
                                disabled={isItemProcessing(item.product._id)}
                                className="w-8 h-8 rounded-md flex items-center justify-center text-cream/50 hover:text-rose hover:bg-rose/10 transition-all font-bold disabled:opacity-50"
                              >
                                <span className="material-symbols-outlined text-sm">
                                  add
                                </span>
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {isItemProcessing(item.product._id) && (
                                <span className="w-5 h-5 border-2 border-rose border-t-transparent rounded-full animate-spin" />
                              )}
                              <p className="text-cream font-bold text-sm">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {isAuthenticated && cart.items.length > 0 && (
              <div className="p-6 bg-noir-medium border-t border-rose/10 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-cream-muted text-sm px-1">
                    <span>Subtotal</span>
                    <span>₹{cart.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-cream text-lg font-bold px-1 py-2 border-t border-cream/5">
                    <span style={{ fontFamily: "var(--font-display)" }}>
                      Grand Total
                    </span>
                    <span className="text-rose">₹{cart.totalAmount}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="w-full btn-primary flex items-center justify-center gap-2 group py-4 text-noir"
                >
                  <span className="font-bold">Proceed to Checkout</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform font-bold">
                    payments
                  </span>
                </Link>

                <p className="text-center text-[10px] text-cream-muted uppercase tracking-widest">
                  Secure Checkout Powered by Cocoa & Cherry
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

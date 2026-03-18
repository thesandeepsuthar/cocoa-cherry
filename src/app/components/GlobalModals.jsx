'use client';

import { useEffect } from 'react';
import LoginModal from "./auth/LoginModal";
import CartDrawer from "./cart/CartDrawer";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export default function GlobalModals() {
  const { isLoginOpen, setIsLoginOpen } = useAuth();
  const { isCartOpen, setIsCartOpen } = useCart();

  const handleCloseLogin = () => setIsLoginOpen(false);

  // Close cart when login opens
  useEffect(() => {
    if (isLoginOpen) {
      setIsCartOpen(false);
    }
  }, [isLoginOpen, setIsCartOpen]);

  return (
    <>
      <LoginModal isOpen={isLoginOpen} onClose={handleCloseLogin} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

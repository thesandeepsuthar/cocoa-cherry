'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { cart, loadCart } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    mobile: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Pre-fill address from user profile
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        name: user.name || '',
        mobile: user.mobile || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        pincode: user.address?.pincode || '',
        country: user.address?.country || 'India'
      }));
    }

    loadCart();
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress,
          paymentMethod: 'cod',
          notes
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/orders/${data.data.order.orderId}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-10 text-cream flex items-center gap-3 uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)' }}>
          <span className="w-10 h-[1px] bg-rose/30" />
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address Form */}
          <div className="card-noir p-8 rounded-[2rem] border-rose/10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-rose/5 blur-[50px] -mr-16 -mt-16 rounded-full" />
            <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="material-symbols-outlined text-rose">local_shipping</span>
              Shipping Destination
            </h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    Signatory Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    Contact Identity
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={shippingAddress.mobile}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                    placeholder="10-digit number"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                  Arrival Point (Street Address)
                </label>
                <textarea
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full input-noir py-3 px-4 font-bold min-h-[100px]"
                  placeholder="Apartment, Street, Area"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={shippingAddress.pincode}
                    onChange={handleInputChange}
                    className="w-full input-noir py-3 px-4 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[10px] font-bold text-rose uppercase tracking-widest mb-3 ml-1">
                  Artisanal Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                  placeholder="Special instructions or requests"
                  className="w-full input-noir py-3 px-4 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 shadow-xl shadow-rose/20 uppercase tracking-[0.2em] font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-noir border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">auto_awesome</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="card-noir p-8 rounded-[2rem] border-rose/10 shadow-2xl h-fit glass-strong">
            <h2 className="text-xl font-bold text-cream mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="material-symbols-outlined text-rose">fact_check</span>
              Selections
            </h2>
            
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex items-center space-x-4">
                  {item.product.images?.[0] && (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                   <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-cream truncate">{item.product.name}</h3>
                    <p className="text-rose text-xs font-bold uppercase tracking-wider">{item.quantity} Unit(s)</p>
                  </div>
                   <div className="text-right">
                    <p className="font-black text-gold">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-rose/10 pt-6 space-y-4">
              <div className="flex justify-between items-center text-cream/60">
                <span className="text-xs uppercase tracking-widest font-bold">Base Valuation</span>
                <span className="font-bold">₹{cart.totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase tracking-widest font-bold text-cream/60">Logistics</span>
                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">Complimentary</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-rose/10">
                <span className="text-lg font-bold text-cream uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-display)' }}>Total</span>
                <span className="text-2xl font-black text-gold font-display">₹{cart.totalAmount}</span>
              </div>
            </div>

            <div className="mt-8 p-5 bg-noir-light rounded-[1.5rem] border border-rose/10 shadow-inner">
              <h3 className="font-bold text-rose text-xs uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">payments</span>
                Payment Protocol
              </h3>
              <p className="text-cream/50 text-xs leading-relaxed uppercase tracking-widest font-medium">
                Standard Settlement: <span className="text-cream font-bold">Cash on Delivery</span>. Verification completed upon arrival.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadOrder();
  }, [isAuthenticated, params.orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${params.orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data.order);
      } else {
        router.push("/orders");
      }
    } catch (error) {
      console.error("Load order error:", error);
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(`/api/orders/${params.orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await response.json();

      if (data.success) {
        setOrder(data.data.order);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Failed to cancel order");
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <button
            onClick={() => router.push("/orders")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => router.push("/orders")}
              className="text-rose/60 hover:text-rose mb-4 transition-all flex items-center gap-2 group text-xs font-bold uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">
                arrow_back
              </span>
              Return to Registry
            </button>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-xs font-black text-rose uppercase tracking-[0.3em]">
                Signature Order
              </span>
              <h1 className="text-3xl font-bold text-cream font-display">
                #{order.orderId}
              </h1>
            </div>
            <p className="text-cream/40 text-[10px] font-bold uppercase tracking-widest pl-1">
              Inscribed on {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                order.status === "pending"
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                  : order.status === "processing"
                    ? "bg-sky-500/10 text-sky-500 border-sky-500/20 shadow-sky-500/5"
                    : order.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5"
                      : "bg-rose/10 text-rose border-rose/20 shadow-rose-500/5"
              }`}
            >
              {order.status}
            </span>
            {order.status === "pending" && (
              <div className="mt-4">
                <button
                  onClick={handleCancelOrder}
                  className="text-rose/40 hover:text-rose text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Void Request
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose/5 blur-[50px] -mr-16 -mt-16 rounded-full" />
              <h2
                className="text-lg font-bold text-cream mb-8 uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="material-symbols-outlined text-rose">
                  shopping_bag
                </span>
                Acquisition Elements
              </h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-6 pb-6 border-b border-rose/5 last:border-b-0 last:pb-0 group/item"
                  >
                    {item.product?.images?.[0] && (
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-rose/10">
                        <img
                          src={item.product.images[0].url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-cream truncate">
                        {item.name}
                      </h3>
                      <p className="text-rose text-[10px] font-bold uppercase tracking-widest mt-1">
                        Valuation: ₹{item.price}
                      </p>
                      <p className="text-cream/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                        Units: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-gold font-display">
                        ₹{item.subtotal}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8 relative overflow-hidden">
              <h2
                className="text-lg font-bold text-cream mb-8 uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="material-symbols-outlined text-rose">
                  timeline
                </span>
                Logistics Sequence
              </h2>
              <div className="relative space-y-10 pl-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-rose/10">
                <div className="relative group">
                  <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-rose flex items-center justify-center border-4 border-noir shadow-[0_0_15px_rgba(230,126,128,0.3)]">
                    <span className="material-symbols-outlined text-[10px] text-noir font-black">
                      check
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-cream text-xs uppercase tracking-widest">
                      Order Inaugurated
                    </p>
                    <p className="text-[10px] text-cream/40 font-bold uppercase tracking-widest mt-1">
                      {new Date(order.orderDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.status !== "pending" && (
                  <div className="relative group">
                    <div
                      className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-noir transition-all duration-500 ${
                        ["processing", "completed"].includes(order.status)
                          ? "bg-rose shadow-[0_0_15px_rgba(230,126,128,0.3)]"
                          : "bg-noir-light border-rose/10"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[10px] text-noir font-black">
                        {["processing", "completed"].includes(order.status)
                          ? "check"
                          : "hourglass_top"}
                      </span>
                    </div>
                    <div>
                      <p
                        className={`font-bold text-xs uppercase tracking-widest ${
                          ["processing", "completed"].includes(order.status)
                            ? "text-cream"
                            : "text-cream/20"
                        }`}
                      >
                        Processing Elements
                      </p>
                      <p className="text-[10px] text-cream/30 font-bold uppercase tracking-widest mt-1">
                        Manual verification in progress
                      </p>
                    </div>
                  </div>
                )}

                {order.status === "completed" && (
                  <div className="relative group">
                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-noir shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <span className="material-symbols-outlined text-[10px] text-noir font-black">
                        done_all
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-cream text-xs uppercase tracking-widest">
                        Handover Accomplished
                      </p>
                      {order.deliveryDate && (
                        <p className="text-[10px] text-cream/40 font-bold uppercase tracking-widest mt-1">
                          {new Date(order.deliveryDate).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {order.status === "cancelled" && (
                  <div className="relative group">
                    <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-rose flex items-center justify-center border-4 border-noir shadow-[0_0_15px_rgba(230,126,128,0.3)]">
                      <span className="material-symbols-outlined text-[10px] text-noir font-black">
                        close
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-rose text-xs uppercase tracking-widest">
                        Request Voided
                      </p>
                      <p className="text-[10px] text-rose/30 font-bold uppercase tracking-widest mt-1">
                        This acquisition was terminated
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8 glass-strong">
              <h2
                className="text-lg font-bold text-cream mb-6 uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="material-symbols-outlined text-rose">
                  fact_check
                </span>
                Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/50">
                  <span>Valuation</span>
                  <span>₹{order.totalAmount}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/50">
                  <span>Logistics</span>
                  <span className="text-emerald-500">Complimentary</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-rose/10">
                  <span className="text-sm font-black text-cream uppercase tracking-[0.2em]">
                    Total
                  </span>
                  <span className="text-2xl font-black text-gold font-display">
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8">
              <h2
                className="text-lg font-bold text-cream mb-6 uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="material-symbols-outlined text-rose">
                  account_balance_wallet
                </span>
                Settlement
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/50">
                  <span>Technique</span>
                  <span className="text-cream">
                    {order.paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-widest text-cream/50">
                  <span>Status</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                      order.paymentStatus === "paid"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8">
              <h2
                className="text-lg font-bold text-cream mb-6 uppercase tracking-[0.2em] flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <span className="material-symbols-outlined text-rose">
                  pin_drop
                </span>
                Destination
              </h2>
              <div className="text-[11px] font-bold uppercase tracking-widest text-cream/50 leading-relaxed space-y-1">
                <p className="text-cream text-xs mb-2">
                  {order.shippingAddress.name}
                </p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p>{order.shippingAddress.pincode}</p>
                <p className="text-rose/60 mt-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                  {order.shippingAddress.mobile}
                </p>
              </div>
            </div>

            {order.notes && (
              <div className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8">
                <h2 className="text-xs font-bold text-rose uppercase tracking-[0.2em] mb-4">
                  Artisanal Directives
                </h2>
                <p className="text-[11px] font-medium text-cream/60 leading-relaxed italic">
                  &ldquo;{order.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

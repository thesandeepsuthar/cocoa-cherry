"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }
    loadOrders();
  }, [isAuthenticated, filter]);

  const loadOrders = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: page.toString() });
      if (filter !== "all") {
        params.append("status", filter);
      }

      const response = await fetch(`/api/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error("Load orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "preparing":
        return "bg-sky-500/10 text-sky-500 border-sky-500/20";
      case "ready":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "out_for_delivery":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "cancelled":
        return "bg-rose/10 text-rose border-rose/20";
      default:
        return "bg-cream/10 text-cream border-cream/20";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "preparing":
        return "Preparing";
      case "ready":
        return "Ready";
      case "out_for_delivery":
        return "Out for Delivery";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getStatusIndex = (status) => {
    const statuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
    ];
    return statuses.indexOf(status);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "schedule";
      case "confirmed":
        return "check_circle";
      case "preparing":
        return "bakery_dining";
      case "ready":
        return "inventory_2";
      case "out_for_delivery":
        return "local_shipping";
      case "completed":
        return "done_all";
      case "cancelled":
        return "cancel";
      default:
        return "circle";
    }
  };

  // Timeline Component
  const OrderTimeline = ({ status }) => {
    const statuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "out_for_delivery",
      "completed",
    ];
    const currentIndex = getStatusIndex(status);
    const isCancelled = status === "cancelled";

    if (isCancelled) {
      return (
        <div className="mb-6 p-4 bg-rose/10 rounded-2xl border border-rose/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-rose">
                cancel
              </span>
            </div>
            <div>
              <p className="text-rose font-bold text-sm">Order Cancelled</p>
              <p className="text-cream/50 text-xs">
                This order has been cancelled
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6 p-4 bg-noir-light/50 rounded-2xl border border-rose/10">
        {/* Desktop Timeline */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-cream/10 -z-0">
              <div
                className="h-full bg-gradient-to-r from-rose to-emerald-500 transition-all duration-500"
                style={{
                  width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
                }}
              />
            </div>

            {statuses.map((s, index) => {
              const isCompleted = index <= currentIndex;
              const isCurrent = index === currentIndex;
              return (
                <div key={s} className="flex flex-col items-center z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? isCurrent
                          ? "bg-rose text-noir shadow-lg shadow-rose/30 scale-110"
                          : "bg-emerald-500 text-noir"
                        : "bg-cream/10 text-cream/30"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-lg"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {isCompleted
                        ? isCurrent
                          ? getStatusIcon(s)
                          : "check"
                        : getStatusIcon(s)}
                    </span>
                  </div>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${isCurrent ? "text-rose" : isCompleted ? "text-emerald-400" : "text-cream/30"}`}
                  >
                    {s === "out_for_delivery" ? "Delivery" : s}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2">
            {statuses.slice(0, currentIndex + 1).map((s, index) => (
              <div key={s} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === currentIndex
                        ? "bg-rose text-noir"
                        : "bg-emerald-500 text-noir"
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {index === currentIndex ? getStatusIcon(s) : "check"}
                    </span>
                  </div>
                  <p
                    className={`text-[9px] font-bold uppercase mt-1 ${index === currentIndex ? "text-rose" : "text-emerald-400"}`}
                  >
                    {s === "out_for_delivery" ? "Delivery" : s}
                  </p>
                </div>
                {index < currentIndex && (
                  <div className="w-6 h-0.5 bg-emerald-500 mx-1" />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-cream/50 mt-3 text-center">
            Current Status:{" "}
            <span className="text-rose font-bold">
              {getStatusLabel(status)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      const data = await response.json();

      if (data.success) {
        loadOrders();
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

  return (
    <div className="min-h-screen bg-noir py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1
          className="text-3xl font-bold mb-10 text-cream flex items-center gap-3 uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="w-10 h-[1px] bg-rose/30" />
          Order History
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { key: "all", label: "All Orders" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "preparing", label: "Preparing" },
            { key: "ready", label: "Ready" },
            { key: "out_for_delivery", label: "Out for Delivery" },
            { key: "completed", label: "Delivered" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                filter === tab.key
                  ? "bg-rose text-noir border-rose shadow-lg shadow-rose/20"
                  : "bg-noir-light text-cream/40 border-rose/10 hover:border-rose/30 hover:text-cream"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="card-noir py-20 text-center rounded-[2rem] border-rose/5">
            <div className="w-20 h-20 rounded-full bg-rose/5 flex items-center justify-center text-rose/20 mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">
                history_toggle_off
              </span>
            </div>
            <p className="text-cream/40 mb-8 uppercase tracking-widest text-sm">
              No digital footprints found
            </p>
            <button
              onClick={() => router.push("/")}
              className="btn-primary py-4 px-10 shadow-rose/20 uppercase tracking-widest text-xs font-bold"
            >
              Initiate First Acquisition
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="card-noir rounded-[2rem] border-rose/10 shadow-2xl p-8 hover:border-rose/30 transition-all duration-500 group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose/5 blur-[40px] -mr-12 -mt-12 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Order Timeline */}
                <OrderTimeline status={order.status} />

                <div className="flex justify-between items-start mb-6 pb-6 border-b border-rose/5">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black text-rose uppercase tracking-[0.3em]">
                        Signature
                      </span>
                      <h3 className="font-bold text-cream text-lg tracking-wider">
                        #{order.orderId}
                      </h3>
                    </div>
                    <p className="text-cream/40 text-[10px] font-bold uppercase tracking-widest">
                      Inscribed on{" "}
                      {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                    <p className="text-xl font-black text-gold mt-3 font-display">
                      ₹{order.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-[10px] font-black text-cream/30 uppercase tracking-[0.3em] mb-4">
                      Acquisition Registry
                    </h4>
                    <div className="space-y-4">
                      {order.items.slice(0, 2).map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center space-x-4 bg-noir-light p-3 rounded-2xl border border-rose/5 group/item"
                        >
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-xl border border-rose/10 group-hover/item:scale-110 transition-transform"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-cream text-sm truncate">
                              {item.name}
                            </p>
                            <p className="text-rose text-[10px] font-bold uppercase tracking-widest mt-0.5">
                              {item.quantity} UNIT(S)
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-[10px] text-cream/30 uppercase tracking-[0.3em] font-bold ml-4">
                          + {order.items.length - 2} Additional Elements
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-cream/30 uppercase tracking-[0.3em] mb-4">
                      Arrival Destination
                    </h4>
                    <div className="text-[11px] text-cream/50 uppercase tracking-widest font-bold leading-relaxed space-y-1">
                      <p className="text-cream">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.pincode}
                      </p>
                      <p className="text-rose/60 mt-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[14px]">
                          call
                        </span>
                        {order.shippingAddress.mobile}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-rose/10">
                  <div className="flex gap-6">
                    <button
                      onClick={() => router.push(`/orders/${order.orderId}`)}
                      className="text-cream text-[10px] font-bold uppercase tracking-[0.2em] border-b-2 border-transparent hover:border-rose transition-all flex items-center gap-2"
                    >
                      Audit Details{" "}
                      <span className="material-symbols-outlined text-sm">
                        open_in_new
                      </span>
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order.orderId)}
                        className="text-rose/40 hover:text-rose text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2"
                      >
                        Void Request{" "}
                        <span className="material-symbols-outlined text-sm">
                          cancel
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="text-[9px] text-cream/30 uppercase tracking-[0.4em] font-black">
                    Settlement: {order.paymentMethod}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 bg-noir-light p-4 rounded-full border border-rose/10 w-fit mx-auto">
                {pagination.hasPrev && (
                  <button
                    onClick={() => loadOrders(pagination.currentPage - 1)}
                    className="w-10 h-10 rounded-full border border-rose/20 flex items-center justify-center text-rose hover:bg-rose hover:text-noir transition-all duration-300"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                )}
                <span className="text-[10px] font-bold text-cream uppercase tracking-widest">
                  Page {pagination.currentPage} / {pagination.totalPages}
                </span>
                {pagination.hasNext && (
                  <button
                    onClick={() => loadOrders(pagination.currentPage + 1)}
                    className="w-10 h-10 rounded-full border border-rose/20 flex items-center justify-center text-rose hover:bg-rose hover:text-noir transition-all duration-300"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

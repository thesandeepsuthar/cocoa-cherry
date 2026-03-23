"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
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

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders);
        setStats(data.data.stats);
        setPagination(data.data.pagination);
      } else if (response.status === 403) {
        alert("Access denied. Admin privileges required.");
        router.push("/");
      }
    } catch (error) {
      console.error("Load orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        loadOrders();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Update order error:", error);
      alert("Failed to update order");
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

  if (!isAuthenticated) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin - Order Management</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/admin/users")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Manage Users
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Back to Site
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat._id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold capitalize">
                  {stat._id} Orders
                </h3>
                <p className="text-2xl font-bold text-blue-600">{stat.count}</p>
                <p className="text-sm text-gray-600">
                  ₹{stat.totalAmount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-6">
          {[
            { key: "all", label: "All Orders" },
            { key: "pending", label: "Pending" },
            { key: "processing", label: "Processing" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-md ${
                filter === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
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
          <div className="text-center py-8">
            <p className="text-gray-600">No orders found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            #{order.orderId}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.paymentMethod.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.user.mobile}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.items.length} items
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items[0]?.name}
                          {order.items.length > 1 &&
                            ` +${order.items.length - 1} more`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹{order.totalAmount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/admin/orders/${order.orderId}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {order.status === "pending" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.orderId, "processing")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Process
                            </button>
                          )}
                          {order.status === "processing" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.orderId, "completed")
                              }
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  {pagination.hasPrev && (
                    <button
                      onClick={() => loadOrders(pagination.currentPage - 1)}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Previous
                    </button>
                  )}
                  {pagination.hasNext && (
                    <button
                      onClick={() => loadOrders(pagination.currentPage + 1)}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Next
                    </button>
                  )}
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page{" "}
                      <span className="font-medium">
                        {pagination.currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {pagination.totalPages}
                      </span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      {pagination.hasPrev && (
                        <button
                          onClick={() => loadOrders(pagination.currentPage - 1)}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Previous
                        </button>
                      )}
                      {pagination.hasNext && (
                        <button
                          onClick={() => loadOrders(pagination.currentPage + 1)}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          Next
                        </button>
                      )}
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

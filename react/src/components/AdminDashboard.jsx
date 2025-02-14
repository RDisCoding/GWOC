import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Home, ClipboardList, History, Settings, MessageSquare, LogOut } from "lucide-react";
import CustomizeMenu from "./CustomizeMenu";
import CustomerFeedbacks from "./CustomerFeedbacks";
import axios from "axios";
import DashboardContent from "./DashboardContent";

const tabs = [
  { name: "Dashboard", icon: Home },
  { name: "Current Orders", icon: ClipboardList },
  { name: "Order History", icon: History },
  { name: "Customize Menu", icon: Settings },
  { name: "Customer Feedbacks", icon: MessageSquare },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("adminActiveTab") || "Dashboard"
  );
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(
    localStorage.getItem("acceptingOrders") !== "false"
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const adminName = localStorage.getItem("adminName") || "Admin";

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate('/admin/login');
  };
  
  const toggleOrderAcceptance = () => {
    const newStatus = !isAcceptingOrders;
    setIsAcceptingOrders(newStatus);
    localStorage.setItem("acceptingOrders", newStatus);
    window.dispatchEvent(new Event("orderAcceptanceChanged"));
  };

  useEffect(() => {
    // Save active tab to localStorage
    localStorage.setItem("adminActiveTab", activeTab);
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      if (activeTab === "Current Orders") fetchCurrentOrders();
      if (activeTab === "Order History") fetchOrderHistory();
    }, 10000); // Refresh every 10 seconds

    // Cleanup interval on unmount or tab change
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "Current Orders") fetchCurrentOrders();
    if (activeTab === "Order History") fetchOrderHistory();
  }, [activeTab]);

  const fetchCurrentOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/current-orders");
      setCurrentOrders(response.data);
    } catch (error) {
      console.error("Error fetching current orders:", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/order-history");
      setOrderHistory(response.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const markAsPickedUp = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/admin/current-orders/${orderId}/pickup`
      );
  
      if (response.data.order) {
        const pickedUpOrder = response.data.order;
        
        setCurrentOrders(prev => prev.filter(order => order.order_id !== orderId));
        setOrderHistory(prev => [
          ...prev,
          {
            ...pickedUpOrder,
            picked_up_at: new Date().toISOString(),
            reviewed: false,
            review_request_sent: false
          }
        ]);
  
        alert("Order marked as picked up successfully!");
      }
    } catch (error) {
      console.error("Error marking order as picked up:", error);
      alert(`Failed to mark order as picked up: ${error.response?.data?.error || error.message}`);
    }
  };

  const requestReview = async (orderId) => {
    try {
      await axios.post(`http://localhost:5000/admin/order-history/${orderId}/request-review`);
      fetchOrderHistory(); // Refresh order history
    } catch (error) {
      console.error("Error requesting review:", error);
    }
  };
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "Current Orders":
        return (
          <div className="p-6 flex flex-col items-center h-full">
            <div className="w-full max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Current Orders</h2>
                <button
                  onClick={toggleOrderAcceptance}
                  className={`px-4 py-2 rounded transition-colors ${
                    isAcceptingOrders 
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {isAcceptingOrders ? "Accepting Orders" : "Not Accepting Orders"}
                </button>
              </div>
              {currentOrders.length === 0 ? (
                <div className="text-center text-gray-500 h-full flex items-center justify-center">
                  <p className="text-xl">No current orders right now</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                  {currentOrders.map((order) => (
                <div key={order.order_id} className="border p-6 mb-6 rounded-lg shadow-md text-center">
                  <p><strong>Order ID:</strong> {order.order_id}</p>
                  <p><strong>User:</strong> {order.user_name} ({order.contact_phone})</p>
                  <p><strong>Total:</strong> ${order.total ? Number(order.total).toFixed(2) : "0.00"}</p>
                  <p><strong>Status:</strong> {order.pickup_status}</p>
                  <p><strong>Items:</strong></p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} (x{item.quantity})</li>
                    ))}
                  </ul>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                    onClick={() => markAsPickedUp(order.order_id)}
                  >
                    Mark as Picked Up
                  </button>
                  </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        case "Order History":
          return (
            <div className="p-6 flex flex-col items-center h-full">
              <div className="w-full max-w-6xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order History</h2>
                  <button
                    className={`px-4 py-2 rounded ${
                      isAcceptingOrders 
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {isAcceptingOrders ? "Accepting Orders" : "Not Accepting Orders"}
                  </button>
                </div>
                {orderHistory.length === 0 ? (
                  <div className="text-center text-gray-500 h-full flex items-center justify-center">
                    <p className="text-xl">No order history available</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[calc(100vh-180px)] overflow-y-auto">
                    {orderHistory.map((order) => (
                      <div key={order.order_id} className="border p-6 rounded-lg shadow-md">
                        <p><strong>Order ID:</strong> {order.order_id}</p>
                        <p><strong>User:</strong> {order.user_name}</p>
                        <p><strong>Total:</strong> ${order.total ? Number(order.total).toFixed(2) : "0.00"}</p>
                        <p><strong>Picked Up At:</strong> {new Date(order.picked_up_at).toLocaleString()}</p>
                        <p><strong>Reviewed:</strong> {order.reviewed ? "Yes" : "No"}</p>
                        {!order.reviewed && !order.review_request_sent && (
                          <button
                            className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
                            onClick={() => requestReview(order.order_id)}
                          >
                            Request Review
                          </button>
                  )}
                </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      case "Customize Menu":
        return <CustomizeMenu />;
      case "Customer Feedbacks":
        return <CustomerFeedbacks />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold mb-2">My App</h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString()} <br />
            {new Date().toLocaleTimeString()}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`flex items-center space-x-3 p-3 w-full rounded-md transition ${
                activeTab === tab.name ? "bg-gray-700" : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab(tab.name)}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
              {adminName.charAt(0)}
            </div>
            <span className="font-medium">{adminName}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full rounded-md hover:bg-gray-700 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <div className="h-full bg-white shadow-md rounded-lg overflow-y-auto">
          {renderContent()}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirm Logout</h3>
            <p className="mb-4">Are you sure you want to logout?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
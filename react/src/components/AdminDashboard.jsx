import React, { useState, useEffect } from "react";
import { Home, ClipboardList, History, Settings, MessageSquare } from "lucide-react";
import CustomizeMenu from "./CustomizeMenu";
import CustomerFeedbacks from "./CustomerFeedbacks";
import axios from "axios";

const tabs = [
  { name: "Dashboard", icon: Home },
  { name: "Current Orders", icon: ClipboardList },
  { name: "Order History", icon: History },
  { name: "Customize Menu", icon: Settings },
  { name: "Customer Feedbacks", icon: MessageSquare },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [currentOrders, setCurrentOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

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
        return <div className="text-center text-xl font-bold p-6">Welcome to the Admin Dashboard</div>;
      case "Current Orders":
        return (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Current Orders</h2>
            {currentOrders.map((order) => (
              <div key={order.order_id} className="border p-6 mb-6 rounded-lg shadow-md w-3/4 text-center">
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
        );
      case "Order History":
        return (
          <div className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>
            {orderHistory.map((order) => (
              <div key={order.order_id} className="border p-6 mb-6 rounded-lg shadow-md w-3/4 text-center">
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
        <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
          <h1 className="text-xl font-bold mb-6">Admin Panel</h1>
          <nav className="space-y-4">
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
        </aside>
  
        <main className="flex-1 overflow-hidden">
          <div className="h-full bg-white shadow-md m-6 rounded-lg">
            {renderContent()}
          </div>
        </main>
      </div>
    );
  };
  
  export default AdminDashboard;
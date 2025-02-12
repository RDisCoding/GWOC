import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";

// Components
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import Orders from "./components/Orders";
import Hampers from "./components/Hampers";
import Cart from "./components/Cart";
import Home from "./components/Home";
import ProductDetails from "./components/ProductDetails";
import ViewAllProducts from "./components/ViewAllProducts";
import AdminDashboard from "./components/AdminDashboard";
import ReviewDialog from "./components/ReviewDialog";

const App3 = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [showReviewDialog, setShowReviewDialog] = useState(false);

    useEffect(() => {
        const checkPendingReviews = async () => {
            if (!isAuthenticated || !localStorage.token) return;
            
            try {
                const response = await fetch("http://localhost:5000/api/reviews/pending", {
                    headers: {
                        'Authorization': `Bearer ${localStorage.token}`
                    }
                });
                const data = await response.json();
                
                if (data.length > 0) {
                    setShowReviewDialog(true);
                }
            } catch (error) {
                console.error('Error checking pending reviews:', error);
            }
        };

        checkPendingReviews();
    }, [isAuthenticated]);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    };

    async function isAuth() {
        try {
            const response = await fetch("http://localhost:5000/auth/is-verify", {
                method: "GET",
                headers: { token: localStorage.token },
            });

            const parseRes = await response.json();
            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
        }
    }

    async function getUserName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token },
            });

            const parseRes = await response.json();
            setUserName(parseRes.user_name);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        isAuth();
        if (isAuthenticated) {
            getUserName();
        }
    }, [isAuthenticated]);

    return (
        <Router>
            <MainLayout 
                isAuthenticated={isAuthenticated} 
                setAuth={setAuth} 
                userName={userName}
                showReviewDialog={showReviewDialog}
                setShowReviewDialog={setShowReviewDialog}
            />
        </Router>
    );
};

const MainLayout = ({ isAuthenticated, setAuth, userName, showReviewDialog, setShowReviewDialog }) => {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");

    if (isAdminPage) {
        return <AdminDashboard />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar isAuthenticated={isAuthenticated} setAuth={setAuth} userName={userName} />
            
            <main className="flex-grow px-4 py-6 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-7xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login setAuth={setAuth} />} />
                        <Route path="/register" element={<Register setAuth={setAuth} />} />
                        <Route path="/dashboard" element={<Dashboard setAuth={setAuth} />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/hampers" element={<Hampers />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/category/:categoryName" element={<ViewAllProducts />} />
                    </Routes>
                </div>
            </main>

            <ReviewDialog 
                isOpen={showReviewDialog} 
                onClose={() => setShowReviewDialog(false)} 
            />
        </div>
    );
};

export default App3;
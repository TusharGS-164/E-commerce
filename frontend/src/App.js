import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
// import AdminPanel from "./pages/AdminPanel";
import ProductDetail from "./pages/Productdetail";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Returns from "./pages/Returns";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import { useAuthStore, useCartStore } from "./store";
import "./styles/index.css";

// // Placeholder components for other routes
// const Register = () => (
//   <div
//     className="container"
//     style={{ padding: "40px 20px", textAlign: "center" }}
//   >
//     <h2>Register Page (Similar to Login)</h2>
//   </div>
// );
//const Products = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Products Page (Product Listing)</h2></div>;
//const ProductDetail = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Product Detail Page</h2></div>;
//const Cart = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Shopping Cart Page</h2></div>;
//const Checkout = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Checkout Page</h2></div>;
//const Orders = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>My Orders Page</h2></div>;
//const Profile = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Profile Page</h2></div>;
//const AdminPanel = () => <div className="container" style={{padding: '40px 20px', textAlign: 'center'}}><h2>Admin Panel</h2></div>;

function App() {
  const { user } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/admin" element={<AdminPanel />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/admin" element={<AdminPanel />} /> */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/privacy" element={<Privacy />} />
          </Routes>
          <Footer />
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;

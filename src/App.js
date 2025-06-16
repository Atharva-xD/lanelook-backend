import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/NavLinks/Home.js";
import ShoppingCart from "./components/ShoppingCart.js";
import Contact from "./components/NavLinks/Contact.js";
import About from "./components/NavLinks/About.js";
import Book from "./components/NavLinks/Book.js";
import SignIn from "./components/SignIn.js";
import Shop from "./components/NavLinks/Shop.js";
import Admin from "./components/admin/Admin.js";
import AdminDashboard from "./components/admin/DashboardPage.js";
import StatsCard from "./components/admin/SidebarComponents/StatsCard.js"; 
import OrdersTable from "./components/admin/SidebarComponents/OrdersTable.js";
import UsersTable from "./components/admin/SidebarComponents/UsersTable.js";
import ProductsChart from "./components/admin/SidebarComponents/ProductsChart.js";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PopupProvider } from "./context/PopupContext";

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/signin" />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <PopupProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<Book />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </PopupProvider>
    </AuthProvider>
  );
}

export default App;

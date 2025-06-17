import "./App.css";
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PopupProvider } from "./context/PopupContext";
import Navbar from './components/Navbar';
import Home from './components/NavLinks/Home';
import Shop from './components/NavLinks/Shop';
import About from './components/NavLinks/About';
import Contact from './components/NavLinks/Contact';
import Book from './components/NavLinks/Book';
import SignIn from './components/SignIn';
import ShoppingCart from './components/ShoppingCart';
import Admin from './components/admin/Admin';
import Services from './components/Services';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <SignIn close={() => navigate('/')} />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <div>Access Denied</div>;
  }

  return children;
};

// Wrapper component to use useNavigate
const AppRoutes = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book" element={<Book />} />
        <Route path="/signin" element={<SignIn close={() => navigate('/')} />} />
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
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PopupProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </PopupProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App;

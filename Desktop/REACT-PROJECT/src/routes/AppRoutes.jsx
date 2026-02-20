import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProductList from '../products/ProductList';
import ProductDetails from '../products/ProductDetails';
import AddProduct from '../products/AddProduct';
import Profile from '../profile/Profile';
import Navbar from '../layout/Navbar';

const RouteGuard = ({ children, requireAuth = false, requireAdmin = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">טוען...</div>;
  }

  if (!requireAuth && user) {
    return <Navigate to="/home" replace />;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route 
          path="/login" 
          element={
            <RouteGuard>
              <Login />
            </RouteGuard>
          } 
        />
        <Route 
          path="/register" 
          element={
            <RouteGuard>
              <Register />
            </RouteGuard>
          } 
        />

        <Route 
          path="/home" 
          element={
            <RouteGuard requireAuth>
              <Navbar />
              <ProductList />
            </RouteGuard>
          } 
        />
        
        <Route 
          path="/product/:id" 
          element={
            <RouteGuard requireAuth>
              <Navbar />
              <ProductDetails />
            </RouteGuard>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <RouteGuard requireAuth>
              <Navbar />
              <Profile />
            </RouteGuard>
          } 
        />
        
        <Route 
          path="/add-product" 
          element={
            <RouteGuard requireAuth requireAdmin>
              <Navbar />
              <AddProduct />
            </RouteGuard>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
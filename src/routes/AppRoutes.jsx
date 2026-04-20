import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../auth/Login';
import Register from '../auth/Register';
import ProductList from '../products/ProductList';
import HomePage from '../products/HomePage';
import ProductDetails from '../products/ProductDetails';
import AddProduct from '../products/AddProduct';
import Wishlist from '../products/Wishlist';
import BuildBox from '../products/BuildBox';
import Profile from '../profile/Profile';
import Cart from '../cart/Cart';
import Checkout from '../cart/Checkout';
import Orders from '../cart/Orders';
import Navbar from '../layout/Navbar';
import ScrollToTop from '../components/ScrollToTop';
import NotFound from '../components/NotFound';

const RouteGuard = ({ children, requireAuth = false, requireAdmin = false }) => {
  const user = useSelector(state => state.user.currentUser);

  if (!requireAuth && user) return <Navigate to="/home" replace />;
  if (requireAuth && !user) return <Navigate to="/login" replace />;
  if (requireAdmin && user && !user.isAdmin) return <Navigate to="/home" replace />;

  return children;
};

const AuthLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login"    element={<RouteGuard><Login /></RouteGuard>} />
        <Route path="/register" element={<RouteGuard><Register /></RouteGuard>} />

        <Route path="/home"    element={<RouteGuard requireAuth><AuthLayout><HomePage /></AuthLayout></RouteGuard>} />
        <Route path="/catalog"  element={<RouteGuard requireAuth><AuthLayout><ProductList /></AuthLayout></RouteGuard>} />
        <Route path="/product/:id" element={<RouteGuard requireAuth><AuthLayout><ProductDetails /></AuthLayout></RouteGuard>} />
        <Route path="/profile" element={<RouteGuard requireAuth><AuthLayout><Profile /></AuthLayout></RouteGuard>} />
        <Route path="/cart"    element={<RouteGuard requireAuth><AuthLayout><Cart /></AuthLayout></RouteGuard>} />
        <Route path="/checkout" element={<RouteGuard requireAuth><AuthLayout><Checkout /></AuthLayout></RouteGuard>} />
        <Route path="/orders"  element={<RouteGuard requireAuth><AuthLayout><Orders /></AuthLayout></RouteGuard>} />
        <Route path="/wishlist" element={<RouteGuard requireAuth><AuthLayout><Wishlist /></AuthLayout></RouteGuard>} />
        <Route path="/build-box" element={<RouteGuard requireAuth><AuthLayout><BuildBox /></AuthLayout></RouteGuard>} />
        <Route path="/add-product" element={<RouteGuard requireAuth requireAdmin><AuthLayout><AddProduct /></AuthLayout></RouteGuard>} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"


// ======================================================
// AUTH
// ======================================================

import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ResetPassword from "./pages/auth/ResetPassword"


// ======================================================
// AUTH PROTECTION
// ======================================================

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx"


// ======================================================
// CUSTOMER
// ======================================================

import Home from "./pages/customer/Home"
import ProductListing from "./pages/customer/ProductListing"
import ProductDetails from "./pages/customer/ProductDetails"
import AISearch from "./pages/customer/AISearch"
import Cart from "./pages/customer/Cart"
import Checkout from "./pages/customer/Checkout"
import OrderSuccess from "./pages/customer/OrderSuccess"
import MyOrders from "./pages/customer/MyOrders"
import OrderDetails from "./pages/customer/OrderDetails"
import OrderTracking from "./pages/customer/OrderTracking"
import ReturnRequest from "./pages/customer/ReturnRequest"
import ReturnStatus from "./pages/customer/ReturnStatus"
import Wishlist from "./pages/customer/Wishlist"
import RecentlyViewed from "./pages/customer/RecentlyViewed"
import Profile from "./pages/customer/Profile"
import Addresses from "./pages/customer/Addresses"
import SizePreferences from "./pages/customer/SizePreferences"
import Reviews from "./pages/customer/Reviews"


// ======================================================
// SELLER
// ======================================================

import SellerDashboard from "./pages/seller/SellerDashboard"
import SellerProducts from "./pages/seller/SellerProducts"
import AddProduct from "./pages/seller/AddProduct"
import SellerOrders from "./pages/seller/SellerOrders"
import SellerReturns from "./pages/seller/SellerReturns"
import SellerAnalytics from "./pages/seller/SellerAnalytics"
import SellerProfile from "./pages/seller/SellerProfile"


// ======================================================
// SUPPORT AGENT
// ======================================================

import SupportDashboard from "./pages/support/Dashboard"
import SupportQueries from "./pages/support/Queries"
import SupportQueryDetails from "./pages/support/QueryDetails"
import SupportReturns from "./pages/support/Returns"
import SupportReturnDetails from "./pages/support/ReturnDetails"
import SupportCustomers from "./pages/support/Customers"
import SupportCustomerDetails from "./pages/support/CustomerDetails"
import SupportProfile from "./pages/support/SupportProfile"


// ======================================================
// ADMIN
// ======================================================

import AdminDashboard from "./pages/admin/Dashboard"
import AdminProducts from "./pages/admin/Products"
import AdminOrders from "./pages/admin/Orders"
import AdminReturns from "./pages/admin/Returns"
import AdminCustomers from "./pages/admin/Customers"
import AdminCategories from "./pages/admin/Categories"
import AdminAnalytics from "./pages/admin/Analytics"
import AdminProfile from "./pages/admin/AdminProfile"


// ======================================================
// UNAUTHORIZED
// ======================================================

import Unauthorized from "./pages/Unauthorized"


function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================================
            ROOT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ==================================================
            AUTHENTICATION
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/unauthorized"
          element={<Unauthorized />}
        />


        {/* ==================================================
            CUSTOMER
            CUSTOMER ONLY
        ================================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["CUSTOMER"]}
            />
          }
        >

          <Route
            path="/customer/home"
            element={<Home />}
          />

          <Route
            path="/customer/products"
            element={<ProductListing />}
          />

          <Route
            path="/customer/product/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/customer/ai-search"
            element={<AISearch />}
          />

          <Route
            path="/customer/cart"
            element={<Cart />}
          />

          <Route
            path="/customer/checkout"
            element={<Checkout />}
          />

          <Route
            path="/customer/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/customer/orders"
            element={<MyOrders />}
          />

          <Route
            path="/customer/orders/:id"
            element={<OrderDetails />}
          />

          <Route
            path="/customer/tracking/:id"
            element={<OrderTracking />}
          />

          <Route
            path="/customer/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/customer/recently-viewed"
            element={<RecentlyViewed />}
          />

          <Route
            path="/customer/profile"
            element={<Profile />}
          />

          <Route
            path="/customer/addresses"
            element={<Addresses />}
          />

          <Route
            path="/customer/size-preferences"
            element={<SizePreferences />}
          />

          <Route
            path="/customer/reviews"
            element={<Reviews />}
          />

          <Route
            path="/customer/returns"
            element={<ReturnRequest />}
          />

          <Route
            path="/customer/return-status"
            element={<ReturnStatus />}
          />

        </Route>


        {/* ==================================================
            SELLER
            TEMPORARILY OPEN
            FOR INTERFACE TESTING
        ================================================== */}

        <Route
          path="/seller/dashboard"
          element={<SellerDashboard />}
        />

        <Route
          path="/seller/products"
          element={<SellerProducts />}
        />

        <Route
          path="/seller/products/add"
          element={<AddProduct />}
        />

        <Route
          path="/seller/orders"
          element={<SellerOrders />}
        />

        <Route
          path="/seller/returns"
          element={<SellerReturns />}
        />

        <Route
          path="/seller/analytics"
          element={<SellerAnalytics />}
        />

        <Route
          path="/seller/profile"
          element={<SellerProfile />}
        />


        {/* ==================================================
            SUPPORT AGENT
            TEMPORARILY OPEN
            FOR INTERFACE TESTING
        ================================================== */}

        <Route
          path="/support/dashboard"
          element={<SupportDashboard />}
        />

        <Route
          path="/support/queries"
          element={<SupportQueries />}
        />

        <Route
          path="/support/queries/:id"
          element={<SupportQueryDetails />}
        />

        <Route
          path="/support/returns"
          element={<SupportReturns />}
        />

        <Route
          path="/support/returns/:id"
          element={<SupportReturnDetails />}
        />

        <Route
          path="/support/customers"
          element={<SupportCustomers />}
        />

        <Route
          path="/support/customers/:id"
          element={<SupportCustomerDetails />}
        />

        <Route
          path="/support/profile"
          element={<SupportProfile />}
        />


        {/* ==================================================
            ADMIN
            TEMPORARILY OPEN
            FOR INTERFACE TESTING
        ================================================== */}

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin/products"
          element={<AdminProducts />}
        />

        <Route
          path="/admin/orders"
          element={<AdminOrders />}
        />

        <Route
          path="/admin/returns"
          element={<AdminReturns />}
        />

        <Route
          path="/admin/customers"
          element={<AdminCustomers />}
        />

        <Route
          path="/admin/categories"
          element={<AdminCategories />}
        />

        <Route
          path="/admin/analytics"
          element={<AdminAnalytics />}
        />

        <Route
          path="/admin/profile"
          element={<AdminProfile />}
        />


        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  )
}


export default App
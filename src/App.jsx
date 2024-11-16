import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminDashboard from "./admin/Dashboard";
import ManageInventory from "./admin/ManageInventory";
import ManageProducts from "./admin/ManageProducts";
import ManagePromotions from "./admin/ManagePromotions";
import ManageUsers from "./admin/ManageUsers";
import ViewOrders from "./admin/ViewOrders";
import "./App.css";
import { AuthProvider } from "./Context/AuthContext";
import { CartProvider } from "./Context/CartContext";
import {
  AboutUs,
  Admin,
  BuyProduct,
  Cart,
  Category,
  ChatPage,
  CheckOut,
  Home,
  Login,
  Profile,
  Shipper,
  Store,
} from "./Pages";

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Profile" element={<Profile />} />
                <Route path="/Category/:categoryName" element={<Category />} />
                <Route path="/Cart" element={<Cart />} />
                <Route path="/ChatPage" element={<ChatPage />} />
                <Route path="/CheckOut" element={<CheckOut />} />
                <Route
                  path="/Checkout/PaymentCallBack"
                  element={<CheckOut />}
                />
                <Route
                  path="/buy-product/:productId/:storeId"
                  element={<BuyProduct />}
                />
                <Route path="/store/:storeId" element={<Store />} />
                <Route path="/AboutUs" element={<AboutUs />} />
                <Route path="/Admin/*" element={<Admin />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="manage-users" element={<ManageUsers />} />
                  <Route path="manage-products" element={<ManageProducts />} />
                  <Route
                    path="manage-promotions"
                    element={<ManagePromotions />}
                  />
                  <Route
                    path="manage-inventory"
                    element={<ManageInventory />}
                  />
                  <Route path="view-orders" element={<ViewOrders />} />
                </Route>
                <Route path="/Shipper/*" element={<Shipper />}></Route>
              </Routes>
              <ToastContainer />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;

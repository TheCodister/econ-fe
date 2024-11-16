import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./admin/Dashboard";
import ManageInventory from "./admin/ManageInventory";
import ManageProducts from "./admin/ManageProducts";
import ManagePromotions from "./admin/ManagePromotions";
import ManageUsers from "./admin/ManageUsers";
import ViewOrders from "./admin/ViewOrders";
import "./App.css";
import { initializeChat } from "./config/gemini";
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
  const initializeChatSession = async () => {
    await initializeChat();
  };
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/ChatPage"
                onClick={initializeChatSession()}
                element={<ChatPage />}
              />
              <Route path="/Login" element={<Login />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Category/:categoryName" element={<Category />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/CheckOut" element={<CheckOut />} />
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
                <Route path="manage-inventory" element={<ManageInventory />} />
                <Route path="view-orders" element={<ViewOrders />} />
              </Route>
              <Route path="/Shipper/*" element={<Shipper />}></Route>
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

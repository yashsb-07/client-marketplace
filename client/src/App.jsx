import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import BuyerDashboardPage from "./pages/BuyerDashboardPage";
import LoginPage from "./pages/LoginPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/marketplace"
            element={<MarketplacePage />}
          />

          <Route
            path="/marketplace/products/:id"
            element={<ProductDetailsPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/buyer"
              element={<BuyerDashboardPage />}
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate
                to="/marketplace"
                replace
              />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
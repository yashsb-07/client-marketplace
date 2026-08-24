import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

function App() {
  return (
    <BrowserRouter>
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
          path="*"
          element={<Navigate to="/marketplace" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
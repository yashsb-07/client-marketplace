import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import MarketplacePage from "./pages/MarketplacePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/marketplace"
          element={<MarketplacePage />}
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
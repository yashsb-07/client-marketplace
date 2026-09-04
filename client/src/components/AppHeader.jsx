import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./AppHeader.css";

function AppHeader() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();

    if (location.pathname !== "/marketplace") {
      navigate("/marketplace", { replace: true });
    }
  };

  const getNavLinkClass = ({ isActive }) =>
    `app-header__link${isActive ? " app-header__link--active" : ""}`;

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand" onClick={closeMenu}>
          CLIENT MARKETPLACE
        </Link>

        <button
          type="button"
          className="app-header__menu-button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        {!loading && (
          <nav
            className={`app-header__nav${
              menuOpen ? " app-header__nav--open" : ""
            }`}
            aria-label="Main navigation"
          >
            {(!isAuthenticated || user?.role !== "SELLER") && (
              <NavLink
                to="/marketplace"
                className={getNavLinkClass}
                onClick={closeMenu}
              >
                Marketplace
              </NavLink>
            )}

            {!isAuthenticated && (
              <>
                <NavLink
                  to="/login"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  Login
                </NavLink>

                <NavLink
                  to="/register"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  Register
                </NavLink>
              </>
            )}

            {isAuthenticated && user?.role === "BUYER" && (
              <>
                <NavLink
                  to="/buyer"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  My Account
                </NavLink>

                <NavLink
                  to="/cart"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  Cart
                </NavLink>

                <button
                  type="button"
                  className="app-header__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {isAuthenticated && user?.role === "SELLER" && (
              <>
                <NavLink
                  to="/seller"
                  end
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  Seller Dashboard
                </NavLink>

                <NavLink
                  to="/seller/products"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  My Products
                </NavLink>

                <button
                  type="button"
                  className="app-header__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}

            {isAuthenticated && user?.role === "ADMIN" && (
              <>
                <NavLink
                  to="/admin"
                  className={getNavLinkClass}
                  onClick={closeMenu}
                >
                  Admin Dashboard
                </NavLink>

                <button
                  type="button"
                  className="app-header__logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default AppHeader;

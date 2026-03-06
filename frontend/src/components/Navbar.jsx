import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  clearAuthToken,
  getAuthToken,
  getCurrentUser,
  logoutUser,
} from "../services/authService";
import "../styles/profileHoverCard.css";
import "../styles/navbar.css";

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();

      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await getCurrentUser();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    };

    loadUser();
  }, [location.pathname]);

  const { initials, displayName } = useMemo(() => {
    const fullName = user?.name || "";
    const parts = fullName.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
      return { initials: "U", displayName: "User" };
    }

    if (parts.length === 1) {
      return {
        initials: parts[0][0].toUpperCase(),
        displayName: parts[0],
      };
    }

    return {
      initials: `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase(),
      displayName: `${parts[0]} ${parts[parts.length - 1]}`,
    };
  }, [user]);

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("lang", e.target.value);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Continue local cleanup even if backend logout fails.
    }
    clearAuthToken();
    setUser(null);
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">

        {/* Logo / Title */}
        <span
          className="navbar-brand fw-bold text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {t("navbar.title")}
        </span>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          
          <div className="me-auto" />

          {/* Right Side (All in One Row) */}
          <div className="d-flex align-items-center gap-3">

            {/* Language Dropdown */}
            <select
              className="form-select form-select-sm nav-language-select"
              style={{ width: "110px" }}
              value={i18n.language}
              onChange={changeLanguage}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="gu">GU</option>
              <option value="pa">PA</option>
              <option value="mr">MR</option>
            </select>

            {!user && (
              <>
                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => navigate("/login")}
                >
                  {t("navbar.login")}
                </button>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/register")}
                >
                  {t("navbar.register")}
                </button>
              </>
            )}

            {user && (
              <div
                className="profile-hover-container"
                onMouseEnter={() => setIsProfileMenuOpen(true)}
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <button
                  type="button"
                  className="profile-chip"
                  title="Profile menu"
                  aria-haspopup="menu"
                  aria-expanded={isProfileMenuOpen}
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                >
                  <span className="profile-initials">{initials}</span>
                  <span className="profile-display-name">{displayName}</span>
                </button>

                <div className={`profile-dropdown ${isProfileMenuOpen ? "open" : ""}`} role="menu">
                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate(`/dashboard/${user.role}`);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    type="button"
                    className="profile-menu-item logout"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
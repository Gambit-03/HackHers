import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
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
          
          {/* Left Side Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
            <li className="nav-item">
              <span
                className="nav-link"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                {t("navbar.home")}
              </span>
            </li>
          </ul>

          {/* Right Side (All in One Row) */}
          <div className="d-flex align-items-center gap-3">

            {/* Language Dropdown */}
            <select
              className="form-select form-select-sm"
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

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
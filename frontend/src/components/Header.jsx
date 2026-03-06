import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleHeaderClick = () => {
    navigate("/");
  };

  return (
    <AppBar
      position="fixed"
      className="bg-white shadow-md"
      sx={{ backgroundColor: "#fff", color: "#111", zIndex: 1200 }}
    >
      <Toolbar sx={{ minHeight: "64px !important", paddingLeft: 2, paddingRight: 2 }}>
        <Box
          className="flex items-center gap-3"
          sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer" }}
          onClick={handleHeaderClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleHeaderClick();
            }
          }}
        >
          <img
            src="/pm-logo.svg"
            alt="PM Internship Logo"
            style={{ width: 40, height: 40, objectFit: "contain" }}
          />
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, fontWeight: 700 }}
          >
            PM Internship Scheme - Government of India
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
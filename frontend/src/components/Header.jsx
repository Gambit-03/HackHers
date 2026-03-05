import { AppBar, Toolbar, Typography, Box } from "@mui/material";

function Header() {
  return (
    <AppBar position="fixed" className="bg-white shadow-md">
      <Toolbar className="flex justify-between items-center">
        <Box className="flex items-center gap-3">
          <img
            src="/pm-logo.png"
            alt="PM Internship Logo"
            className="h-10"
          />
          <Typography
            variant="h6"
            className="text-black font-bold text-sm md:text-lg"
          >
            PM Internship Scheme - Government of India
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
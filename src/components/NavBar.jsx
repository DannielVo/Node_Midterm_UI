import React, { useContext } from "react";
import { Navbar, Container, Nav, Stack, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem("User");
    setUser(null);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
      <Container className="p-3">
        {/* Logo / Brand */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span
            style={{ fontWeight: "700", fontSize: "1.5rem", color: "#f0ad4e" }}
          >
            Emoji Chat
          </span>
        </Navbar.Brand>

        {/* Responsive toggle */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <Notification />
                <Stack
                  direction="horizontal"
                  gap={3}
                  className="align-items-center"
                >
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="align-items-center"
                  >
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: "#f0ad4e",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "0.9rem",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-warning fw-medium">
                      {user.name.length > 12
                        ? user.name.slice(0, 12) + "…"
                        : user.name}
                    </span>
                  </Stack>
                  <Button
                    variant="outline-warning"
                    size="md"
                    onClick={handleLogout}
                    style={{ minWidth: "80px" }}
                  >
                    Logout
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  </Button>
                </Stack>
              </>
            ) : (
              <Stack direction="horizontal" gap={3}>
                <Link
                  to="/login"
                  className="text-light text-decoration-none fw-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-light text-decoration-none fw-medium"
                >
                  Register
                </Link>
              </Stack>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;

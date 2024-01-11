import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const CustomNavbar = ({ sessionInfo, onLogout, setNavbarHeight }) => {
  const navbarRef = useRef(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (navbarRef.current) {
      setNavbarHeight(navbarRef.current.clientHeight);
    }
  }, [expanded, setNavbarHeight]);

  return (
    <Navbar
      ref={navbarRef}
      bg="dark"
      variant="dark"
      expand="lg"
      className="shadow"
      fixed="top"
      expanded={expanded}
    >
      <Container>
        <Navbar.Brand as={NavLink} to="/" onClick={() => setExpanded(false)}>
          CrownzCom
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded((expanded) => !expanded)}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {sessionInfo ? (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/"
                  onClick={() => setExpanded(false)}
                >
                  Home
                </Nav.Link>
                <NavLink
                  className="nav-link"
                  to="/profile"
                  onClick={() => setExpanded(false)}
                >
                  Profile
                </NavLink>
                <Nav.Link
                  onClick={() => {
                    onLogout();
                    setExpanded(false);
                  }}
                  as={NavLink}
                  to="/sign-in"
                >
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/sign-in"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/sign-up"
                  onClick={() => setExpanded(false)}
                >
                  Sign up
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/testing"
                  onClick={() => setExpanded(false)}
                >
                  Testing
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;

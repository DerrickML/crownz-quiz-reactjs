import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

const CustomNavbar = ({ sessionInfo, onLogout }) => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          CrownzCom
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {sessionInfo ? (
              <>
                <Nav.Link as={NavLink} to="/">
                  Home
                </Nav.Link>
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
                <Nav.Link onClick={onLogout} as={NavLink} to="/sign-in">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/sign-in">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/sign-up">
                  Sign up
                </Nav.Link>
                <Nav.Link as={NavLink} to="/testing">
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

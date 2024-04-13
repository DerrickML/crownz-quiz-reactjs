import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFacebook, faTwitter, faLinkedinIn, faInstagram } from '@fortawesome/free-solid-svg-icons';
import './Footer.css'; // Import custom CSS

function Footer() {
    return (
        <footer className="footer">
            <Container>
                <Row className="align-items-center justify-content-between">
                    {/* <Col md={4}>
                        <p className="footer-text">Connect with us:</p>
                        <div className="social-icons">
                            <FontAwesomeIcon icon={faFacebookF} size="lg" />
                            <FontAwesomeIcon icon={faTwitter} size="lg" />
                            <FontAwesomeIcon icon={faLinkedinIn} size="lg" />
                            <FontAwesomeIcon icon={faInstagram} size="lg" />
                        </div>
                    </Col>
                    <Col md={4} className="text-md-center">
                        <p className="footer-text mb-md-0">Explore our services and learn more at <a href="https://crownzcom.net">www.crownzcom.net</a></p>
                    </Col> */}
                    <Col md={12} className="text-md-right">
                        <p className="footer-text mb-0">© {new Date().getFullYear()}  <a href="https://crownzcom.net">Crownzcom Limited</a>, All rights reserved.</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}

export default Footer;

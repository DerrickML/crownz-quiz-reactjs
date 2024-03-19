import React from "react";
import { Card, Button, Container, Image, Col, Alert } from 'react-bootstrap';
import './OrderSummery.css'

function OrderSummery() {
    return (
        <div className="OrderSummeryContainer">
            <Col className="card">
                <div className="card__header">
                    <img src="images/illustration-hero.svg" alt="hero svg" />
                </div>
                <Card className="card__body">
                    <Card.Body className="card__content">
                        <Card.Header>Order Summary</Card.Header>
                        <Card.Text>
                            You can now listen to millions of songs, audiobooks, and podcasts on
                            any device anywhere you like!
                        </Card.Text>
                        <Alert className="card__plan">
                            <div>
                                <Image src="../../images/icon-music.svg" alt="music icon" />
                                <div className="card__price">
                                    <h2>Annual Plan</h2>
                                    <p>$59.99/year</p>
                                </div>
                            </div>
                            <a href="#!"> Change</a>
                        </Alert>
                    </Card.Body>
                    <Card.Footer className="card__footer">
                        <Button className="card__payment-btn">Proceed to Payment</Button>
                        <Button className="card__cancel-btn">Cancel Order</Button>
                    </Card.Footer>
                </Card>
            </Col>
        </div>

    )
}

export default OrderSummery
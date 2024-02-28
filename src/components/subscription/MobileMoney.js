import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function MobileMoney() {
    const [formData, setFormData] = useState({
        phone_number: '',
        network: '',
        amount: '',
        currency: 'UGX',
        email: ''
    });
    const [paymentStatus, setPaymentStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus(null);

        try {
            const response = await fetch('https://8f1d-41-210-147-48.ngrok-free.app/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.status === "success" && data.meta.authorization.mode === "redirect") {
                window.location.href = data.meta.authorization.redirect;
            } else {
                setPaymentStatus(data.message);
            }
        } catch (error) {
            console.error('Error making payment:', error);
            setPaymentStatus('Error making payment. Please try again.');
        }
    };

    return (
        <div className="mt-4">
            <h3>Mobile Money Payment</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" name="phone_number" placeholder="Enter phone number" value={formData.phone_number} onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Network</Form.Label>
                    <Form.Control as="select" name="network" value={formData.network} onChange={handleChange}>
                        <option value="">Select Network</option>
                        <option value="MTN">MTN</option>
                        <option value="AIRTEL">AIRTEL</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleChange} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
                </Form.Group>

                <Button variant="success" type="submit">Pay with Mobile Money</Button>

                {paymentStatus && <Alert className="mt-3" variant="info">{paymentStatus}</Alert>}
            </Form>
        </div>
    );
}

export default MobileMoney;

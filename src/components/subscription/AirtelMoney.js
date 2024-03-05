import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useAuth } from '../../context/AuthContext';
function AirtelMoney({ price }) {
    const { userInfo } = useAuth();

    const [phone, setPhone] = useState(userInfo.phone || '');
    // const [email, setEmail] = useState(userInfo.email || 'crownzcom@gmail.com');
    const [email, setEmail] = useState('crownzcom@gmail.com');
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone
    const [amount, setAmount] = useState(price ? price : '2000');

    const [formData, setFormData] = useState({
        phone_number: phone,
        network: 'AIRTEL',
        amount: amount,
        currency: 'UGX',
        email: email
    });
    const [paymentStatus, setPaymentStatus] = useState(null);

    // const handleChange = (e) => {
    //     setFormData({ ...formData, [e.target.name]: e.target.value });
    // };

    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPaymentStatus(null);

        setFormData({ ...formData, phone_number: phone });

        if (!formData.phone_number) {
            setMessage('Please enter phone number.');
            return;
        }

        // Validate phone numbers
        const isUserPhoneValid = !validatePhoneNumber(phone);

        if (!isUserPhoneValid) {
            setPhoneError(!isUserPhoneValid);
            return;
        }

        try {

            const response = await fetch('http://localhost:3002/pay', {
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
                <Form.Group className="mb-3">
                    <Form.Label>Phone Number*</Form.Label>
                    <PhoneInput
                        className={`form-control ${phoneError ? "is-invalid" : "custom-phone-input "
                            }`}
                        placeholder="Enter phone number"
                        international
                        defaultCountry="UG"
                        name="phone_number"
                        countryCallingCodeEditable={false}
                        value={phone}
                        onChange={setPhone}
                        required
                    />
                    {phoneError && (
                        <Form.Control.Feedback type="invalid">
                            Invalid phone number
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                <Button variant="success" type="submit">Pay with Mobile Money</Button>

                {paymentStatus && <Alert className="mt-3" variant="info">{paymentStatus}</Alert>}
            </Form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default AirtelMoney;

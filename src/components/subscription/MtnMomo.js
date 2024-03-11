import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import 'react-phone-number-input/style.css';
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useAuth } from '../../context/AuthContext';

const MtnMomo = ({ price }) => {
    const { userInfo } = useAuth();

    const serverUrl = "https://2wkvf7-3000.csb.app"
    const serverMomoRoute = `${serverUrl}/mtnMomo`

    const [phone, setPhone] = useState(userInfo.phone || '');
    const [amount, setAmount] = useState(price ? price : '2000');
    const [message, setMessage] = useState('');
    const [phoneError, setPhoneError] = useState(false); // Error flag for user's phone


    const createApiUser = async () => {
        console.log('Creating API user...');
        // Add the logic to create an API user
        // You should replace the URL with your server's endpoint for creating an API user
        // This is a sample logic
        const response = await fetch(`${serverMomoRoute}/create-api-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    };

    const getCreatedUser = async (userId) => {
        console.log('Retrieving created user...');
        const response = await fetch(`${serverMomoRoute}/get-created-user/${userId}`);
        return response.json();
    };

    const retrieveApiKey = async (userId) => {
        console.log('Retrieving API key...');
        const response = await fetch(`${serverMomoRoute}/retrieve-api-key/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    };

    const generateApiToken = async (userId, apiKey) => {
        console.log('Generating MoMo token...');
        const response = await fetch(`${serverMomoRoute}/generate-api-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, apiKey })
        });
        return response.json();
    }

    const requestToPay = async (phone, amount, momoTokenId) => {
        console.log('Making payment request...');
        console.log('MoMo Token: ', JSON.stringify(momoTokenId));
        const response = await fetch(`${serverMomoRoute}/request-to-pay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${momoTokenId}`
            },
            body: JSON.stringify({ phone, total: amount, momoTokenId })
        });
        return response.json();
    };

    // Phone number validation function
    const validatePhoneNumber = (phoneNumber) => {
        return phoneNumber && !isValidPhoneNumber(phoneNumber);
    };

    const handlePayment = async () => {
        if (!phone || !amount) {
            setMessage('Please enter both phone number and amount.');
            return;
        }

        // Validate phone numbers
        const isUserPhoneValid = !validatePhoneNumber(phone);

        if (!isUserPhoneValid) {
            setPhoneError(!isUserPhoneValid);
            return;
        }

        try {
            const userCreationResponse = await createApiUser();
            const userId = userCreationResponse.userId;
            console.log('User ID: ', userId);

            // await getCreatedUser(userId);

            const apiKeyResponse = await retrieveApiKey(userId);
            const apiKey = apiKeyResponse.apiKey;
            console.log('API key: ' + apiKey)

            const tokenResponse = await generateApiToken(userId, apiKey);
            const momoTokenId = tokenResponse.access_token;
            console.log('API token: ' + momoTokenId)

            const paymentResponse = await requestToPay(phone, amount, momoTokenId);

            if (paymentResponse.success) {
                setMessage('Payment successful!');
                console.log('Finshed to make payment...');
            } else {
                setMessage('Payment failed.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setMessage('An error occurred while processing the payment.');
        }
    };

    return (
        <Card>
            <Form.Group className="mb-3">
                <Form.Label>Phone Number*</Form.Label>
                <PhoneInput
                    className={`form-control ${phoneError ? "is-invalid" : "custom-phone-input "
                        }`}
                    placeholder="Enter phone number"
                    international
                    defaultCountry="UG"
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
            <Button onClick={handlePayment}>Pay</Button>
            {message && <p>{message}</p>}
        </Card>
    );
};

export default MtnMomo;

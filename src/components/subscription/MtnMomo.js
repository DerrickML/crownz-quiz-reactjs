import React, { useState } from 'react';

const MtnMomo = () => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const createApiUser = async () => {
        console.log('Creating API user...');
        // Add the logic to create an API user
        // You should replace the URL with your server's endpoint for creating an API user
        // This is a sample logic
        const response = await fetch('http://localhost:3001/create-api-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    };

    const getCreatedUser = async (userId) => {
        console.log('Retrieving created user...');
        const response = await fetch(`http://localhost:3001/get-created-user/${userId}`);
        return response.json();
    };

    const retrieveApiKey = async (userId) => {
        console.log('Retrieving API key...');
        const response = await fetch(`http://localhost:3001/retrieve-api-key/${userId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        return response.json();
    };

    const generateApiToken = async (userId, apiKey) => {
        console.log('Generating MoMo token...');
        const response = await fetch('http://localhost:3001/generate-api-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, apiKey })
        });
        return response.json();
    }

    const requestToPay = async (phone, amount, momoTokenId) => {
        console.log('Making payment request...');
        console.log('MoMo Token: ', JSON.stringify(momoTokenId));
        const response = await fetch('http://localhost:3001/request-to-pay', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${momoTokenId}`
            },
            body: JSON.stringify({ phone, total: amount, momoTokenId })
        });
        return response.json();
    };

    const handlePayment = async () => {
        if (!phone || !amount) {
            setMessage('Please enter both phone number and amount.');
            return;
        }

        try {
            const userCreationResponse = await createApiUser();
            const userId = userCreationResponse.userId;

            await getCreatedUser(userId);

            const apiKeyResponse = await retrieveApiKey(userId);
            const apiKey = apiKeyResponse.apiKey;

            const tokenResponse = await generateApiToken(userId, apiKey);
            const momoTokenId = tokenResponse.access_token;

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
        <div>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
            />
            <button onClick={handlePayment}>Pay</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default MtnMomo;

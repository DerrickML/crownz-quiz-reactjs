/* global FlutterwaveCheckout */

import React from 'react';

function CardPayment() {
    const makePayment = () => {
        FlutterwaveCheckout({
            public_key: "FLWPUBK_TEST-5ec66010de33c362b7a1730ce87479f5-X",
            tx_ref: `tx-${Date.now()}`,
            amount: 20000,
            currency: "UGX",
            payment_options: "card",
            redirect_url: "https://525e-41-210-145-67.ngrok-free.app",
            customer: {
                email: "customer@example.com",
                phone_number: "08102909304",
                name: "Customer Name",
            },
            customizations: {
                title: "Crownzcom",
                description: "Payment for items Points",
                logo: "https://assets.piedpiper.com/logo.png",
            },
        });
    };

    return (
        <div>
            <h3>Card Payment</h3>
            <button onClick={makePayment} className="btn btn-primary">Pay with Card</button>
        </div>
    );
}

export default CardPayment;

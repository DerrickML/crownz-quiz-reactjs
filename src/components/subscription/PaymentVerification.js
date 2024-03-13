//This component is only meant to run after a transaction is made
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import {
    databases,
    database_id,
    transactionTable_id,
} from "../../appwriteConfig.js";
import Receipt from './Receipt'
import './PaymentResult.css'; // Path to your custom CSS file

const PaymentResult = () => {
    const [transactionData, setTransactionData] = useState({});
    const [paymentStatus, setPaymentStatus] = useState('Verifying...');
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const transactionId = queryParams.get('transaction_id') || parseTransactionIdFromResp(queryParams.get('resp'));
    const serverUrl = "https://2wkvf7-3000.csb.app";
    const { userInfo } = useAuth();

    useEffect(() => {
        const verifyPayment = async () => {
            if (transactionId) {
                try {
                    const response = await fetch(`${serverUrl}/flutterwave/verify-payment/${transactionId}`);
                    const data = await response.json();
                    // await saveTransactionData(data.transactionData); //Saving to database
                    console.log('Transaction data - Client side: ', data);
                    setPaymentStatus(data.status);
                    console.log('Payment status - Client side: ', paymentStatus);

                    try {
                        // Data to send to receipt
                        const receiptData = {
                            tx_ref: data.transactionData.tx_ref,
                            id: data.transactionData.id,
                            charged_amount: data.transactionData.amount,
                            currency: data.transactionData.currency,
                            payment_type: data.transactionData.payment_type,
                            name: data.transactionData.customer.name,
                            email: data.transactionData.customer.email,
                            phone: data.transactionData.customer.phone_number,
                            created_at: data.transactionData.customer.created_at,
                            card: data.transactionData.card || {},
                            description: data.transactionData.meta.description
                        }
                        setTransactionData(receiptData);
                    }
                    catch (e) {
                        console.log("error in recepit ..", e)
                        throw new Error
                    }

                } catch (error) {
                    setPaymentStatus('Verification failed. Please contact support.');
                } finally {
                    setLoading(false);
                }
            } else {
                setPaymentStatus('No transaction ID provided.');
                setLoading(false);
            }
        };

        verifyPayment();
    }, [transactionId]);

    // Function to parse and extract transactionId from 'resp'
    function parseTransactionIdFromResp(resp) {
        if (!resp) return null;
        try {
            const decodedResp = JSON.parse(decodeURIComponent(resp));
            return decodedResp?.data?.id || null;
        } catch (error) {
            console.error('Error parsing resp:', error);
            return null;
        }
    }

    //Function to save transaction data to transaction table
    const saveTransactionData = async (data) => {
        try {
            const response = await databases.createDocument(database_id, transactionTable_id, "unique()",
                {
                    userID: userInfo.userId,
                    transactionDate: data.created_at,
                    transactionAmount: data.amount,
                    currency: data.currency,
                    paymentMethod: data.payment_type,
                    paymentGateway: 'Flutterwave',
                    paymentSatus: data.status,
                    transactionReference: data.tx_ref,
                    transactionId: `${data.id}`
                }
            )
        } catch (error) {
            console.error('Error saving transaction data:', error);
        }
    };

    return (
        <Container className="payment-result-container">
            <h2 className="text-center">Payment Status for {userInfo.firstName}</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Alert variant={paymentStatus === "success" ? 'success' : 'danger'}>
                    <FontAwesomeIcon
                        icon={paymentStatus === "success" ? faCheckCircle : faTimesCircle}
                        size="3x"
                    />
                    <p className="payment-status-message">{paymentStatus}</p>
                </Alert>
            )}
            {paymentStatus === "success" ? <Receipt receiptData={transactionData} /> : null}
        </Container>
    );
};

export default PaymentResult;

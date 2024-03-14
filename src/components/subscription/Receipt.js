import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { formatDate } from '../../utilities/resultsUtil'
import './Receipt.css'; // Import your custom CSS

const Receipt = ({ propReceiptData }) => {
    const location = useLocation();
    const { receiptData } = location.state || { price: 2000, paymentFor: 'points' }; // Set defaultReceiptData
    console.log('Receipt Data: ', receiptData)
    const isCardPayment = receiptData.payment_type === 'card';

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.text("Payment Receipt", 20, 20);
        const bodyContent = [
            ['Transaction Ref', receiptData.tx_ref],
            // ['Receipt Number', `#RECEIPT-${receiptData.id}`],
            ['Receipt Number', receiptData.id],
            ['Amount', `${receiptData.currency} ${receiptData.charged_amount}`],
            ['Payment Type', receiptData.payment_type],
            ['Customer', receiptData.name],
            [receiptData.email ? 'Email' : '', receiptData.email],
            [receiptData.phone ? 'Phone' : '', receiptData.phone],
            ['Transaction Date', formatDate(receiptData.created_at)],
            [receiptData.description ? 'Description' : '', receiptData.description]
        ];

        if (isCardPayment) {
            bodyContent.push(['Card Type', `${receiptData.card.type} (${receiptData.card.first_6digits}******${receiptData.card.last_4digits})`]);
        }

        doc.autoTable({
            head: [['Field', 'Details']],
            body: bodyContent,
            startY: 30,
        });
        doc.save(`receipt-${receiptData.id}.pdf`);
    };

    return (
        <Card className="receipt-card">
            <Card.Header as="h5">Payment Receipt</Card.Header>
            <Card.Body>
                <Card.Title>{receiptData.name}</Card.Title>
                <Card.Text>
                    <strong>Transaction Reference:</strong> {receiptData.tx_ref}<br />
                    <strong>Receipt Number:</strong> #RECEIPT-{receiptData.id}<br />
                    <strong>Amount:</strong> {`${receiptData.currency} ${receiptData.charged_amount}`}<br />
                    <strong>Payment Type:</strong> {receiptData.payment_type}<br />
                    {isCardPayment && <span><strong>Card Information:</strong> {`${receiptData.card.type} (${receiptData.card.first_6digits}******${receiptData.card.last_4digits})`}<br /></span>}
                    {receiptData.phone && <><strong>Phone:</strong> {receiptData.phone}<br /></>}
                    {receiptData.email && <><strong>Email:</strong> {receiptData.email}<br /></>}
                    <strong>Date:</strong> {new Date(receiptData.created_at).toLocaleDateString()}<br />
                    <strong>Description:</strong> {receiptData.description}<br />
                </Card.Text>
                <Button variant="primary" onClick={downloadPdf}>Download Receipt as PDF</Button>
            </Card.Body>
        </Card>
    );
};

export default Receipt;

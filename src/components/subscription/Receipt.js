import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { formatDate } from '../../utilities/resultsUtil'
import './Receipt.css'; // Import your custom CSS

const Receipt = ({ transactionData }) => {
    const isCardPayment = transactionData.payment_type === 'card';

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.text("Payment Receipt", 20, 20);
        const bodyContent = [
            ['Transaction Ref', transactionData.tx_ref],
            // ['Receipt Number', `#RECEIPT-${transactionData.id}`],
            ['Receipt Number', transactionData.id],
            ['Amount', `${transactionData.currency} ${transactionData.charged_amount}`],
            ['Payment Type', transactionData.payment_type],
            ['Customer', transactionData.customer.name],
            ['Email', transactionData.customer.email],
            ['Transaction Date', formatDate(transactionData.created_at)],
        ];

        if (isCardPayment) {
            bodyContent.push(['Card Type', `${transactionData.card.type} (${transactionData.card.first_6digits}******${transactionData.card.last_4digits})`]);
        }

        doc.autoTable({
            head: [['Field', 'Details']],
            body: bodyContent,
            startY: 30,
        });
        doc.save('receipt.pdf');
    };

    return (
        <Card className="receipt-card">
            <Card.Header as="h5">Payment Receipt</Card.Header>
            <Card.Body>
                <Card.Title>{transactionData.customer.name}</Card.Title>
                <Card.Text>
                    <strong>Transaction Reference:</strong> {transactionData.tx_ref}<br />
                    <strong>Receipt Number:</strong> #RECEIPT-{transactionData.id}<br />
                    <strong>Amount:</strong> {`${transactionData.currency} ${transactionData.charged_amount}`}<br />
                    <strong>Payment Type:</strong> {transactionData.payment_type}<br />
                    {isCardPayment && <span><strong>Card Information:</strong> {`${transactionData.card.type} (${transactionData.card.first_6digits}******${transactionData.card.last_4digits})`}<br /></span>}
                    <strong>Email:</strong> {transactionData.customer.email}<br />
                    <strong>Date:</strong> {new Date(transactionData.created_at).toLocaleDateString()}
                </Card.Text>
                <Button variant="primary" onClick={downloadPdf}>Download Receipt as PDF</Button>
            </Card.Body>
        </Card>
    );
};

export default Receipt;

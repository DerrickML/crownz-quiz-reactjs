import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const NavigationCard = ({ title, icon, borderColor, link, number, action }) => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        if (action) {
            action();
        }
        // navigate(link);
        window.location.href = link;

    };

    return (
        <Card
            style={{
                borderColor: borderColor,
                borderWidth: '2px',
                borderStyle: 'solid',
                backgroundColor: '#FFFFFF',
                marginBottom: '20px',
                borderRadius: '15px',
                boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s',
                cursor: 'pointer'
            }}
            className="text-center h-100 p-4"
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
        >
            <Card.Body>
                <FontAwesomeIcon icon={icon} size="2x" color={borderColor} />
                <Card.Title className="mt-3">{title}</Card.Title>
                <Card.Text>
                    Number of Entries: {number}
                </Card.Text>
                <Button variant="outline-dark" onClick={handleButtonClick}>View Details</Button>
            </Card.Body>
        </Card>
    );
};

export default NavigationCard
//  AnswerContainer.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import AnswerContainer from './AnswerContainer';

const Answers = () => {

    const location = useLocation();
    const { questionsData, subjectName, totalMarks } = location.state || { questionsData: [], subjectName: '', totalMarks: 0 };

    return (
        <Container fluid>
            <AnswerContainer questionsData={questionsData} subjectName={subjectName} totalMarks={totalMarks} />
        </Container>
    );
};

export default Answers;

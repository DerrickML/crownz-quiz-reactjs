//  AnswerContainer.js
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, Container } from 'react-bootstrap';
import AnswerCard from './AnswerCard';

const AnswerContainer = ({ questionsData, subjectName, totalMarks }) => {
    console.log("QuizContainer Subject Name:", subjectName + "\nEnd");
    // Extract category IDs dynamically from questionsData
    const categoriesToInclude = questionsData.map(category => category.category);

    const [resultsData, setSelectedQuestions] = useState([]);

    useEffect(() => {
        questionsData.sort((a, b) => a.category - b.category);
        setSelectedQuestions(questionsData);
    }, []); // Empty dependency array to run only once

    console.log("Selected Questions in Quiz Container:\n", resultsData);

    return (
        <Container>
            <Card className="my-4">
                <Card.Header >Exam Results</Card.Header>
                <Card.Body >
                    <Card.Title>
                        Score: {totalMarks}
                    </Card.Title>
                </Card.Body>
            </Card>
            {resultsData.map((category, index) => (
                <Card key={index} style={{ margin: "5px" }}>
                    <h2>{category.category}</h2>
                    <p>{category.instructions}</p>
                    {category.questions.map((question, questionIndex) => {
                        // Check if the question format is 'either' or 'or', otherwise just pass the question
                        let questionProps = question.hasOwnProperty('either') && question.hasOwnProperty('or')
                            ? question
                            : question;
                        // Add category ID to questionProps
                        questionProps = { ...questionProps, categoryId: category.category };
                        return <AnswerCard key={question.id || `${category.$id}_${questionIndex}`} resultsData={questionProps} />;

                    })}
                </Card>
            ))}
        </Container>
    );
};

export default AnswerContainer;

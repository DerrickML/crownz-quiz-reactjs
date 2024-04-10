//  AnswerContainer.js
import React, { useState, useEffect } from 'react';
import { Card, Container, ListGroup, Alert } from 'react-bootstrap';
import AnswerCard from './AnswerCard';

const AnswerContainer = ({ questionsData, subjectName, totalMarks, attemptDate }) => {

    let subject_Name = subjectName === "sst_ple" ? "Social Studies" : (subjectName === "math_ple" ? "Mathematics" : (subjectName === "sci_ple" ? "Science" : subjectName));

    console.log('Attempted questions', questionsData);

    // Extract category IDs dynamically from questionsData
    const categoriesToInclude = questionsData.map(category => category.category);

    const [resultsData, setResultsData] = useState([]);

    useEffect(() => {
        questionsData.sort((a, b) => a.category - b.category);
        setResultsData(questionsData);

    }, []); // Empty dependency array to run only once


    return (
        <Container>
            <Card className="my-4">
                <Card.Header >Exam Results</Card.Header>
                <Card.Body >
                    <Card.Subtitle>
                        <ListGroup as="ol">
                            {subject_Name ? (<ListGroup.Item as="li">Subject: <span style={{ fontStyle: 'normal !important', fontSize: 'medium' }}>{subject_Name}</span></ListGroup.Item>) : null}
                            {totalMarks ? (<ListGroup.Item as="li">Score: <span style={{ fontStyle: 'normal !important', fontSize: 'medium' }}>{totalMarks}</span></ListGroup.Item>) : null}
                            {attemptDate ? (<ListGroup.Item as="li">Date of Exam Submission: <span style={{ fontStyle: 'normal !important', fontSize: 'medium' }}>{attemptDate}</span></ListGroup.Item>) : null}
                        </ListGroup>
                    </Card.Subtitle>
                </Card.Body>
            </Card>
            {resultsData.map((category, index) => (
                <Card key={index} style={{ margin: "5px" }}>
                    {/* <h2>{category.category}</h2> */}
                    <h3>{category.instructions}</h3>

                    {/* {
                        subjectName === 'Social Studies' && (category.category === 36 || category.category === 51) ? <p>Answered questions: {category.questions.length}/5</p> : null
                    } */}

                    {
                        category.questions.length === 0 ? <Alert>No questions attempted</Alert> : subjectName === 'Social Studies' && (category.category === 36 || category.category === 51) ? <Alert>Attempted questions: {category.questions.length}/5</Alert> : null
                    }

                    {category.questions.map((question, questionIndex) => {
                        // Check if the question format is 'either' or 'or', otherwise just pass the question
                        let questionProps = question.hasOwnProperty('either') && question.hasOwnProperty('or')
                            ? question
                            : question;
                        // Add category ID to questionProps
                        questionProps = { ...questionProps, categoryId: category.category };
                        return (
                            <>
                                <div>{category.category + questionIndex}</div>
                                <AnswerCard
                                    key={question.id || `${category.$id}_${questionIndex}`}
                                    category_Id={category.category}
                                    questionIndex={questionIndex}
                                    resultsData={questionProps}
                                />
                            </>);

                    })}
                </Card>
            ))}
        </Container>
    );
};

export default AnswerContainer;

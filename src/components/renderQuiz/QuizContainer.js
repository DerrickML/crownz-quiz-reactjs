// QuizContainer.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { resetAnswers } from './redux/actions';
import { Container, Row, Col, Modal, ButtonGroup, Button, Spinner, Card } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import { generateRandomExam } from './utils';
import SaveButton from './SaveButton';
import QuestionCard from './QuestionCard';
import Timer from './Timer';

const QuizContainer = ({ questionsData, subjectName }) => {
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { userInfo } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const saveButtonRef = useRef(null);

    useEffect(() => {
        const fetchAndSetQuestions = async () => {
            setIsLoading(true);

            try {
                // console.log('Questions : ', questionData)
                // const randomQuestions = await generateRandomExam(questionsData, subjectName, userInfo.userId, userInfo.educationLevel);
                // console.log('randomQuestions', JSON.stringify(randomQuestions))

                // if (randomQuestions) {
                //     setSelectedQuestions(randomQuestions);
                // } else {
                //     console.error('Failed to fetch random questions');
                // }

                if (questionsData) {
                    setSelectedQuestions(questionsData);
                } else {
                    console.error('Questions not available');
                    throw new Error('Questions not available');
                }

            } catch (error) {
                console.error('Error fetching questions:', error);
            }

            setIsLoading(false);
        };

        if (questionsData && subjectName) {
            fetchAndSetQuestions();
        }

    }, [questionsData, subjectName, userInfo.userId, userInfo.educationLevel]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleExitExam = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        dispatch(resetAnswers());
        navigate("/exam-page");
    };

    const handleSubmit = async () => {
        await completeSubmit();
    };

    const completeSubmit = async () => {
        // console.log("Confirmed to submit Submit");
        setIsLoading(true)
        setIsSubmitted(true);
        setShowModal(false);
        setIsLoading(false)
    };

    const initialTime = 90 * 60;
    // const initialTime = 5;

    const handleTimeUp = () => {
        handleSubmit();
        setShowTimeUpModal(true);
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="grow" variant="primary" />
                <Spinner animation="grow" variant="success" />
                <Spinner animation="grow" variant="danger" />
                <Spinner animation="grow" variant="warning" />
                <Spinner animation="grow" variant="info" />
            </div>
        );
    }

    return (
        <Container fluid>
            {isSubmitted ?
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <Spinner animation="grow" variant="primary" />
                    <Spinner animation="grow" variant="success" />
                    <Spinner animation="grow" variant="danger" />
                    <Spinner animation="grow" variant="warning" />
                    <Spinner animation="grow" variant="info" />
                </div>
                :
                <>
                    <div style={{ position: 'sticky', top: 0, zIndex: 2 }}>
                        <Row>
                            <Col xs={12} className="d-md-none bg-light">
                                <Timer initialTime={initialTime} onTimeUp={handleTimeUp} />
                            </Col>
                        </Row>
                    </div>
                    <Row>
                        <Col xs={12} md={2} className="d-none d-md-block position-fixed bg-light" style={{ height: '50vh', overflowY: 'auto' }}>
                            <Timer initialTime={initialTime} onTimeUp={handleTimeUp} />
                            <ButtonGroup>
                                <Button variant="success" onClick={handleOpenModal} className="w-25">
                                    Submit Exam
                                </Button>
                                <Button variant="danger" onClick={handleExitExam} className="w-25">
                                    Exit Exam
                                </Button>
                            </ButtonGroup>
                        </Col>
                        <Col xs={12} md={{ span: 9, offset: 3 }}>
                            {selectedQuestions.map((category, index) => (
                                <div key={index}>
                                    {category.instructions &&
                                        <Card.Title style={{ marginTop: '20px', border: '', borderColor: '' }}>
                                            {category.instructions}
                                        </Card.Title>
                                    }
                                    {category.questions.map((question, index) => {
                                        const isEitherOr = question.hasOwnProperty('either') && question.hasOwnProperty('or');
                                        return (
                                            <QuestionCard
                                                key={question.id || `${category.$id}_${index}`}
                                                questionIndex={index}
                                                question={question}
                                                isEitherOr={isEitherOr}
                                                categoryId={category.category}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} className="d-md-none bg-light fixed-bottom">
                            <div className="d-flex justify-content-center">
                                <ButtonGroup className="w-75">
                                    <Button variant="success" onClick={handleOpenModal}>
                                        Submit Exam
                                    </Button>
                                    <Button variant="danger" onClick={handleExitExam}>
                                        Exit Exam
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                </>}
            <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Exit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to exit the exam? Your progress may not be saved.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowExitModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmExit}>
                        Confirm Exit
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Submission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div hidden={isSubmitted}>Are you sure you want to submit?</div>
                    <SaveButton
                        ref={saveButtonRef}
                        selectedQuestions={selectedQuestions}
                        onSubmit={handleSubmit}
                        disabled={isSubmitted}
                        style={{ backgroundColor: 'blue', color: 'white', fontSize: '20px' }}
                        subject_Name={subjectName}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} hidden={isSubmitted}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showTimeUpModal} onHide={() => setShowTimeUpModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Time's Up!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Your time is up and your Exam has been automatically submitted.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowTimeUpModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <SaveButton
                ref={saveButtonRef}
                selectedQuestions={selectedQuestions}
                onSubmit={handleSubmit}
                disabled={isSubmitted}
                style={{ display: 'none' }}
                buttonDisplay={'none'}
                subject_Name={subjectName}
            />
        </Container>
    );
};

export default QuizContainer;
import React, { useState, forwardRef } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { faSave } from '@fortawesome/free-solid-svg-icons';
import {
    databases,
    database_id,
    studentMarksTable_id,
} from "../../appwriteConfig.js";
import {
    fetchAndUpdateResults,
} from "../../utilities/resultsUtil";
import { sendEmailToNextOfKin } from "../../utilities/otherUtils.js";
import { useAuth } from '../../context/AuthContext';

const SaveButton = forwardRef(({ selectedQuestions, onSubmit, disabled, buttonDisplay, subject_Name }, ref) => {

    const { userInfo } = useAuth();
    let studentID = userInfo.userId;

    let subjectName;
    if (userInfo.educationLevel === 'PLE') {
        subjectName = subject_Name === 'sst_ple' ? 'Social Studies' : (subject_Name === 'math_ple' ? 'Mathematics' : (subject_Name === 'sci_ple' ? 'Science' : 'English Language'));
    }
    else {
        subjectName = subject_Name
    }

    const navigate = useNavigate();

    const reduxState = useSelector(state => state.answers);

    const [isLoading, setIsLoading] = useState(false);

    //Function to submit data the database
    const createDocument = async (data) => {
        try {
            setIsLoading(true); // Start loading
            const result = await databases.createDocument(
                database_id,
                studentMarksTable_id,
                "unique()",
                data
            );
        } catch (error) {
            console.error("Error creating document:", error);
        } finally {
            setIsLoading(false); // Stop loading regardless of success or error
        }
    };

    //Calculating marks
    const calculateMarks = (question) => {
        let marks = 0;
        if ('mark' in question) {
            if (Array.isArray(question.answer) && Array.isArray(question.user_answer)) {
                if (question.user_answer.length > question.mark) {
                    marks = 0;
                } else {
                    marks = question.user_answer.filter(answer => question.answer.includes(answer)).length;
                }
            } else if (question.answer === question.user_answer) {
                marks = question.mark;
            }
        } else {
            if (Array.isArray(question.answer)) {
                if (Array.isArray(question.user_answer)) {
                    if (question.user_answer.length > question.answer.length) {
                        marks = 0;
                    } else {
                        marks = question.user_answer.filter(answer => question.answer.includes(answer)).length;
                    }
                } else if (question.answer.includes(question.user_answer)) {
                    marks = 1;
                }
            } else if (question.answer === question.user_answer) {
                marks = 1;
            }
        }
        return marks;
    };

    const formatAnswersForSaving = () => {
        let totalMarks = 0;
        const formattedData = selectedQuestions.map(category => ({
            category: category.category,
            instruction: category.instructions || null,
            questions: category.questions.map(question => {
                if (question.either && question.or) {
                    const selectedOption = reduxState[`${category.category}-${question.id}-selectedOption`] || 'either';
                    const relevantQuestion = question[selectedOption];

                    const questionKey = `${category.category}-${relevantQuestion.id}`;
                    const userAnswer = reduxState[questionKey] || null;

                    const formattedQuestion = {
                        ...relevantQuestion,
                        user_answer: userAnswer,
                        selectedOption: selectedOption,
                    };

                    if (relevantQuestion.sub_questions) {
                        formattedQuestion.sub_questions = relevantQuestion.sub_questions.map(subQ => {
                            const subQuestionKey = `${category.category}-${subQ.id}`;
                            const subUserAnswer = reduxState[subQuestionKey] || null;

                            return {
                                ...subQ,
                                user_answer: subUserAnswer,
                            };
                        });
                    }

                    return formattedQuestion;
                }

                const questionKey = `${category.category}-${question.id}`;
                const userAnswer = reduxState[questionKey] || null;

                const formattedQuestion = {
                    ...question,
                    user_answer: userAnswer,
                };

                if (question.sub_questions) {
                    formattedQuestion.sub_questions = question.sub_questions.map(subQ => {
                        const subQuestionKey = `${category.category}-${subQ.id}`;
                        const subQUserAnswer = reduxState[subQuestionKey] || null;

                        return {
                            ...subQ,
                            user_answer: subQUserAnswer,
                        };
                    });
                }

                totalMarks += calculateMarks(formattedQuestion);
                return formattedQuestion;
            }),
        }));

        return { formattedData, totalMarks };
    };

    const handleSave = async () => {
        // const finalDataToSave = formatAnswersForSaving();
        const { formattedData: finalDataToSave, totalMarks } = formatAnswersForSaving();
        onSubmit();

        // Create a document in Appwrite Collection
        const resultsString = JSON.stringify(finalDataToSave);

        const userResultsData = {
            studID: studentID,
            marks: totalMarks,
            subject: subjectName,
            results: resultsString,
        }

        await createDocument(userResultsData);

        if (userInfo.kinEmail) {
            await sendEmailToNextOfKin(userInfo, subjectName, totalMarks, new Date());
        }

        await fetchAndUpdateResults(userInfo.userId); // Update the local storage

        //Rendering user attempts to them
        const questionsData = finalDataToSave;

        navigate('/answers', { state: { questionsData, subjectName, totalMarks } });
    };

    return (
        <Button ref={ref} onClick={handleSave} disabled={disabled} variant="primary" style={{ display: buttonDisplay ? buttonDisplay : 'false' }}>
            <FontAwesomeIcon icon={faSave} /> Save Answers
        </Button>
    );
});

export default SaveButton;

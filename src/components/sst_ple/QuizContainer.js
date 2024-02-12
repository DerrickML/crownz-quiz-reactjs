// QuizContainer.js
import React from 'react';
import { QuizProvider } from './QuizContext';
import QuestionCard from './QuestionCard';
import { selectRandomQuestions } from './utils';

const QuizContainer = ({ questionsData }) => {
    // Extract category IDs dynamically from questionsData
    const categoriesToInclude = questionsData.map(category => category.category);

    const selectedQuestions = selectRandomQuestions(questionsData, categoriesToInclude);

    // Sort the selected questions by category ID in ascending order
    selectedQuestions.sort((a, b) => a.category - b.category);

    console.log("Selected Questions in Quiz Container:\n", selectedQuestions);

    return (
        <QuizProvider>
            <div>
                {selectedQuestions.map(category => (
                    <div key={category.$id}>
                        <h2>Category {category.category}</h2>
                        <p>{category.instructions}</p>
                        {category.questions.map((question, index) => {
                            // Check if the question format is 'either' or 'or', otherwise just pass the question
                            let questionProps = question.hasOwnProperty('either') && question.hasOwnProperty('or')
                                ? question
                                : { either: question };
                            // Add category ID to questionProps
                            questionProps = { ...questionProps, categoryId: category.category };
                            return <QuestionCard key={question.id || `${category.$id}_${index}`} questionData={questionProps} />;
                        })}
                    </div>
                ))}
            </div>
        </QuizProvider>
    );
};

export default QuizContainer;

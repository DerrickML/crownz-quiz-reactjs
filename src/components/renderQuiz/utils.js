// utils.js
import { serverUrl } from '../../config.js';
export const isEitherOrFormat = (question) => {
    return question.hasOwnProperty('either') && question.hasOwnProperty('or');
};

/*
- OLD: Does not check whether a question was previously attempted
*/
export const selectRandomQuestions = (questionsData, categoryIds, subjectName) => {
    return categoryIds.map(categoryId => {
        const category = questionsData.find(cat => cat.category === categoryId);
        if (!category) {
            console.warn(`Category ${categoryId} not found`);
            return null;
        }

        let numQuestions = 1;
        if (subjectName === 'sst_ple') {
            if (categoryId === 36 || categoryId === 51) {
                numQuestions = 5;
            }
        }

        const shuffledQuestions = [...category.questions].sort(() => 0.5 - Math.random()).slice(0, numQuestions);

        const updatedQuestions = shuffledQuestions.map(question => {
            const updatedQuestion = { ...question };

            if (question.sub_questions) {
                updatedQuestion.sub_questions = question.sub_questions.map((subQ, index) => ({
                    ...subQ,
                    id: `${question.id}_sub_${index}`
                }));
            }

            // Handling 'either' and 'or' questions
            if (question.either && question.either.sub_questions) {
                updatedQuestion.either.sub_questions = question.either.sub_questions.map((subQ, index) => ({
                    ...subQ,
                    id: `${question.either.id}_sub_${index}`
                }));
            }

            if (question.or && question.or.sub_questions) {
                updatedQuestion.or.sub_questions = question.or.sub_questions.map((subQ, index) => ({
                    ...subQ,
                    id: `${question.or.id}_sub_${index}`
                }));
            }

            return updatedQuestion;
        });

        return { ...category, questions: updatedQuestions };
    }).filter(cat => cat !== null);
};

/*
- Checks if a question was previously attempted
*/
export const selectRandomQuestions2 = (questionsData, categoryIds, subjectName, userHistory, userId, educationLevel) => {

    let updatedUserHistory = {
        userId: userId,
        subjectName: subjectName,
        questionsJSON: { ...userHistory?.questionsJSON }, // Clone the existing history
        educationLevel: educationLevel
    };

    let categoriesWithQuestions = categoryIds.map(categoryId => {
        const category = questionsData.find(cat => cat.category === categoryId);
        if (!category) {
            console.warn(`Category ${categoryId} not found`);
            return null;
        }

        // Retrieve attempted question IDs for this category from userHistory
        let attemptedQuestionIds = userHistory?.questionsJSON?.[categoryId] || [];
        let allQuestionIds = category.questions.map(question => question.id);
        let isCategoryExhausted = attemptedQuestionIds.length === allQuestionIds.length;

        // Reset the history for the category if all questions have been attempted
        if (isCategoryExhausted) {
            attemptedQuestionIds = [];
        }

        // Filter available questions that haven't been attempted yet
        let availableQuestions = category.questions.filter((question, index) => {
            let questionId = isEitherOrFormat(question) ? `${category.questions.indexOf(question)}` : question.id;
            return !attemptedQuestionIds.includes(questionId);
        });

        let numQuestions = 1; // Default number of questions
        if (subjectName === 'sst_ple') {
            if (categoryId === 36 || categoryId === 51) {
                numQuestions = 5;
            }
        }

        // Randomly select questions
        let selectedQuestions = [...availableQuestions].sort(() => 0.5 - Math.random()).slice(0, numQuestions);

        // Handle insufficient new questions
        if (selectedQuestions.length < numQuestions) {
            let questionsNeeded = numQuestions - selectedQuestions.length;
            let additionalQuestions = [];

            for (let i = 0; i < questionsNeeded; i++) {
                if (attemptedQuestionIds.length > 0) {
                    let oldQuestionId = attemptedQuestionIds.shift(); // Remove the oldest question
                    let oldQuestion = category.questions.find(q => q.id === oldQuestionId);
                    if (oldQuestion) {
                        additionalQuestions.push(oldQuestion);
                    }
                }
            }

            selectedQuestions = selectedQuestions.concat(additionalQuestions);

            // Clear the history for this category since all questions have now been used
            if (attemptedQuestionIds.length === 0) {
                updatedUserHistory.questionsJSON[categoryId] = [];
            }
        }

        // Update questions with additional details
        const updatedQuestions = selectedQuestions.map(question => {
            const updatedQuestion = { ...question };

            if (isEitherOrFormat(question)) {
                updatedQuestion.id = `${category.questions.indexOf(question)}`;
            }

            // Handling 'either' and 'or' questions
            if (question.either && question.either.sub_questions) {
                updatedQuestion.either.sub_questions = question.either.sub_questions.map((subQ, index) => ({
                    ...subQ,
                    id: `${question.either.id}_sub_${index}`
                }));
            }

            if (question.or && question.or.sub_questions) {
                updatedQuestion.or.sub_questions = question.or.sub_questions.map((subQ, index) => ({
                    ...subQ,
                    id: `${question.or.id}_sub_${index}`
                }));
            }

            return updatedQuestion;
        });

        // Append the IDs of newly selected questions to updatedUserHistory
        const newQuestionIds = updatedQuestions.map(question => question.id);
        updatedUserHistory.questionsJSON[categoryId] = [...new Set([...attemptedQuestionIds, ...newQuestionIds])];

        return { ...category, questions: updatedQuestions };
    }).filter(cat => cat !== null);

    return {
        updatedUserHistory,
        categoriesWithQuestions
    };
};

/*
- Retrieves previously attempted questions by the user
*/
export const getAttemptedQuestions = async (userId, subjectName, educationLevel) => {
    const url = `${serverUrl}/query/getQtnHistory/${userId}/${subjectName}/${educationLevel}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user history:', error);
        return null; // or handle the error as you see fit
    }
}

/*
- Updates the previously attempted questions list with the current questions
*/
export const updateQuestionHistory = async (selectedQuestionsJSON) => {
    // console.log('Selected Questions to Update: ', selectedQuestionsJSON)
    const url = `${serverUrl}/query/updateQtnHistory/`;
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedQuestionsJSON)
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // or just return true if the response doesn't include any data
    } catch (error) {
        console.error('Error updating question history:', error);
        return null; // or handle the error as you see fit
    }
}

export const isImageUrl = (url) => {
    return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(url);
};

// reducers.js
const initialState = {
    answers: {}
};

const quizReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_ANSWER':
            // Use categoryId and questionId to create a unique key
            const key = `${action.payload.categoryId}-${action.payload.questionId}`;
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [key]: action.payload.answer
                }
            };
        case 'SET_SELECTED_OPTION':
            const optionKey = `${action.payload.categoryId}-${action.payload.questionId}`;
            return {
                ...state,
                answers: {
                    ...state.answers,
                    [optionKey]: action.payload.selectedOption
                }
            };
        default:
            return state;
    }
};

export default quizReducer;

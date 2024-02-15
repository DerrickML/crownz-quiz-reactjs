// actions.js
export const setUserAnswer = (questionId, answer, categoryId) => {
    return {
        type: 'SET_USER_ANSWER',
        payload: { questionId, answer, categoryId }
    };
};

export const setSelectedOption = (questionId, selectedOption, categoryId) => {
    return {
        type: 'SET_SELECTED_OPTION',
        payload: { questionId, selectedOption, categoryId }
    };
};

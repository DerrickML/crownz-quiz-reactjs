// utils.js
export const isEitherOrFormat = (question) => {
    return question.hasOwnProperty('either') && question.hasOwnProperty('or');
};

export const selectRandomQuestions = (questionsData, categoryIds) => {
    return categoryIds.map(categoryId => {
        const category = questionsData.find(cat => cat.category === categoryId);
        if (!category) {
            console.warn(`Category ${categoryId} not found`);
            return null;
        }

        let numQuestions = 1;
        // Select 5 questions for categories 36 and 51
        if (categoryId === 36 || categoryId === 51) {
            numQuestions = 5;
        }

        const shuffledQuestions = [...category.questions].sort(() => 0.5 - Math.random());
        return { ...category, questions: shuffledQuestions.slice(0, numQuestions) };
    }).filter(cat => cat !== null);
};

export const isImageUrl = (url) => {
    return (/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i).test(url);
};

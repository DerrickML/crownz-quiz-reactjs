import React, { useState, useEffect } from "react";
import englishData from "./english.json";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Parse and organize the JSON data
    // For now, we'll just set the imported data directly to state
    setQuestions(englishData);
  }, []);

  return <div>{/* Components for displaying questions will go here */}</div>;
};

export default Quiz;

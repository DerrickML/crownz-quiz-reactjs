import React, { useState, useEffect } from "react";
import IframeComponent from "./IframeComponent";
import QuizContainer from "./renderQuiz/QuizContainer";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { sst_ple, math_ple } from '../otherFiles/questionsData';

function Exam({ subject }) {
    console.log("fires"); // checking the number of times the component fires
    const [showInstructionsModal, setShowInstructionsModal] = useState(true);
    const [showUnavailableModal, setShowUnavailableModal] = useState(false);
    const [data, setData] = useState(null); // Variable to store the fetched data

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data from your cloud Appwrite database
        const fetchData = async () => {
            try {
                const response = await fetch("YOUR_API_ENDPOINT");
                const data = await response.json();
                setData(data); // Assign the fetched data to the variable
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the fetchData function to fetch the data

        // Cleanup function (optional)
        return () => {
            // Perform any cleanup if needed
        };
    }, []); // Empty dependency array ensures the code runs only once

    // Rest of your component code...

    return (
    // JSX code...
  );
}

export default Exam;

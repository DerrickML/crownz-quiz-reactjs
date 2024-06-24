import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { resetAnswers } from './renderQuiz/redux/actions';
import IframeComponent from "./renderQuiz/IframeComponent";
// import QuizContainer from "./sst_ple/QuizContainer";
import QuizContainer from "./renderQuiz/QuizContainer";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  databasesQ,
  database_idQ,
  sstTablePLE_id,
  mathPLE_id,
  engTbalePLE_id,
  sciTablePLE_id,
  QueryQ,
} from "./renderQuiz/examsAppwriteConfig"; //Data from appwrite database
import { useAuth } from "../context/AuthContext.js"
import { getRandomExamBySubject } from "./renderQuiz/utils"
import { sst_ple, math_ple, eng_ple, sci_ple } from '../otherFiles/questionsData'; //Static data from local files
import { serverUrl } from '../config.js';

/**
 * Represents an Exam component.
 * @param {Object} props - The component props.
 * @param {string} props.subject - The subject of the exam.
 * @returns {JSX.Element} The Exam component.
 */
function Exam({ subject }) {
  const dispatch = useDispatch();
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showUnavailableModal, setshowUnavailableModal] = useState(true);
  const [data, setData] = useState(null); // Variable to store the fetched questions data

  const { userInfo } = useAuth();

  const navigate = useNavigate();

  //================================================================
  /* FETCH EXAM FROM SERVER-SIDE */
  const fetchExam = async (subjectName, userId, educationLevel) => {
    const url = `${serverUrl}/exam2/fetch-exam?userId=${userId}&subjectName=${subjectName}&educationLevel=${educationLevel}`;

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
  };
  //================================================================
  useEffect(() => {
    // Clear user answers when this component mounts
    dispatch(resetAnswers());
  }, [dispatch]);

  useEffect(() => {
    // Fetch data from your cloud Appwrite database
    const fetchData = async () => {
      //testing fetch from server-side
      const serverExam = await fetchExam(subject, userInfo.userId, userInfo.educationLevel)
      console.log('exam fetched from server side: ', serverExam.questions);
      let questionData = []
      questionData = serverExam.questions;

      console.log('Questions Client-side: ', questionData);

      // // Convert questions from JSON strings to JSON objects
      // questionData.forEach((obj) => {
      //   obj.questions = obj.questions.map((q) => JSON.parse(q));
      // });

      setData(questionData); // Assign the fetched data to the variable

      //////////////////////////

      try {
        // let collection_id;
        // let subjectName = null;
        // switch (subject) {
        //   case "social-studies_ple":
        //     collection_id = sstTablePLE_id;
        //     subjectName = "sst-ple"
        //     break;
        //   case "mathematics_ple":
        //     collection_id = mathPLE_id;
        //     subjectName = "mtc-ple"
        //     break;
        //   case "english-language_ple":
        //     collection_id = engTbalePLE_id;
        //     subjectName = "eng-ple"
        //     break;
        //   case "science_ple":
        //     collection_id = sciTablePLE_id;
        //     subjectName = "sci-ple"
        //     break;
        //   default:
        //     collection_id = null;
        //     return;
        // }

        // let questionData = [];

        // const response = await databasesQ.listDocuments(
        //   database_idQ,
        //   collection_id,
        //   [QueryQ.limit(80), QueryQ.orderAsc("$id")]
        // );

        // const questions = response.documents;
        // questionData = questions;

        // console.log('Questions Client-side: ', questionData);

        // // Convert questions from JSON strings to JSON objects
        // questionData.forEach((obj) => {
        //   obj.questions = obj.questions.map((q) => JSON.parse(q));
        //   // delete obj.$id
        //   delete obj.$createdAt
        //   delete obj.$updatedAt
        //   delete obj.$permissions
        //   delete obj.$databaseId
        //   delete obj.$collectionId
        // });

        // console.log('Parsed questions: ', questionData);

        // setData(questionData); // Assign the fetched data to the variable

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetchData function to fetch the data

    // Cleanup function
    return () => {
    };
  }, []); // Empty dependency array ensures the code runs only once


  const handleProceed = () => {
    if (subject === 'social-studies_ple' || subject === 'mathematics_ple' || subject === 'english-language_ple' || subject === 'science_ple') {
      setShowInstructionsModal(false);
    }
    else {
      setShowInstructionsModal(false);
      setshowUnavailableModal(false); // Set the subject validity to false
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const renderQuizContent = () => {

    switch (subject) {
      case "english-language_ple":
        // return <IframeComponent url="https://exams.crownz.derrickml.com/english_ple_section_B" />;
        // return <IframeComponent url="https://www.exampreptutor.com/english_ple_section_B/" />;
        // return <IframeComponent url="http://http://192.168.100.12:5173/" />;
        // return <IframeComponent url="http://localhost:5173/" />;

        // return <IframeComponent url="https://exampreptutor.com/english_ple_section_B/" />;

        if (data === null) { return null }
        else {
          // return <QuizContainer questionsData={eng_ple} subjectName={'eng_ple'} />;
          return <QuizContainer questionsData={data} subjectName={'eng_ple'} />;
        };

      case "social-studies_ple":
        if (data === null) { return null }
        else {
          return <QuizContainer questionsData={data} subjectName={'sst_ple'} />;
        };

      case "mathematics_ple":
        // return <QuizContainer questionsData={math_ple} subjectName={'math_ple'} />;
        return <QuizContainer questionsData={data} subjectName={'math_ple'} />;

      case "science_ple":
        return <QuizContainer questionsData={data} subjectName={'sci_ple'} />;

      default:
        return null;

    }
  };

  const subjectInstructions = () => {
    // console.log('Subject Name: ', subject);
    return (
      subject === ('mathematics_ple' || 'mathematics_uce' || 'mathematics_uace') ?
        <>
          <li>Have a piece of paper, pen/pencil, and calculator ready for calculations. </li>
        </>
        : <></>
    )
  }

  return (
    <>
      <Modal show={showInstructionsModal} onHide={() => { }} centered>
        <Modal.Header>
          <Modal.Title>Exam Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here are the instructions for your exam:</p>
          <ul>
            {/* Subject based instructions as needed */}
            {subjectInstructions()}
            {/* Other General instructions as needed */}
            <li>Read each question carefully.</li>
            <li>Ensure you answer all questions.</li>
            <li>Answer multiple-choice questions by selecting the best option.</li>
            <li>Enter text responses for text entry questions in the provided text box.</li>
            <li>Keep track of the time limit and pace yourself accordingly.</li>
            <li>Do not refresh the page during the exam.</li>
            <li>Upon completion, submit the exam and await feedback on your performance.</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceed}>
            Proceed to Exam
          </Button>
        </Modal.Footer>
      </Modal>

      {!showInstructionsModal && showUnavailableModal && renderQuizContent()}

      {!showUnavailableModal &&
        <Modal show={true} onHide={() => { }} centered styles={{ width: '40%', height: '40%' }}>
          <Modal.Header>
            <Modal.Title>Exam Unavailable</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Currently, the exam for the selected subject is not available. Please check back later.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleCancel}>
              Go Back
            </Button>
          </Modal.Footer>
        </Modal>
      }
    </>
  );
}

export default Exam;
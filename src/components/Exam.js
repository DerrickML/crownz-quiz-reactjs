import React, { useState, useEffect } from "react";
import IframeComponent from "./IframeComponent";
// import QuizContainer from "./sst_ple/QuizContainer";
import QuizContainer from "./renderQuiz/QuizContainer";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  databases,
  database_id,
  sstTablePLE_id,
  mathPLE_id,
  engTbalePLE_id,
  sciTablePLE_id,
  Query,
} from "./renderQuiz/examsAppwriteConfig"; //Data from appwrite database
import { sst_ple, math_ple } from '../otherFiles/questionsData'; //Static data from local files

/**
 * Represents an Exam component.
 * @param {Object} props - The component props.
 * @param {string} props.subject - The subject of the exam.
 * @returns {JSX.Element} The Exam component.
 */
function Exam({ subject }) {
  const [showInstructionsModal, setShowInstructionsModal] = useState(true);
  const [showUnavailableModal, setshowUnavailableModal] = useState(true);
  const [data, setData] = useState(null); // Variable to store the fetched questions data

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from your cloud Appwrite database
    const fetchData = async () => {
      try {
        let collection_id;
        switch (subject) {
          case "social-studies_ple":
            collection_id = sstTablePLE_id;
            break;
          case "mathematics_ple":
            collection_id = mathPLE_id;
            break;
          case "english-language_ple":
            collection_id = engTbalePLE_id;
            break;
          case "science_ple":
            collection_id = sciTablePLE_id;
            break;
          default:
            // collection_id = null;
            return;
        }
        const response = await databases.listDocuments(
          database_id,
          collection_id,
          [Query.limit(80), Query.orderAsc("$id")]
        );

        const questions = response.documents;
        const questionData = questions;
        // Convert questions from JSON strings to JSON objects
        questionData.forEach((obj) => {
          obj.questions = obj.questions.map((q) => JSON.parse(q));
          // delete obj.$id
          delete obj.$createdAt
          delete obj.$updatedAt
          delete obj.$permissions
          delete obj.$databaseId
          delete obj.$collectionId
        });
        setData(questionData); // Assign the fetched data to the variable
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
        return <IframeComponent url="https://exams.crownz.derrickml.com/english_ple_section_B" />;
      // return <IframeComponent url="https://moodle.servers.crownzcom.tech/english_ple_section_B" />;
      case "social-studies_ple":
        if (data === null) { return null }
        else {
          return <QuizContainer questionsData={data} subjectName={'sst_ple'} />;
        };
      case "mathematics_ple":
        // return <QuizContainer questionsData={data} subjectName={'math_ple'} />;
        return <QuizContainer questionsData={math_ple} subjectName={'math_ple'} />;
      case "science_ple":
        return <QuizContainer questionsData={data} subjectName={'sci_ple'} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Modal show={showInstructionsModal} onHide={() => { }} centered>
        <Modal.Header>
          <Modal.Title>Exam Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Here are the instructions for your exam:</p>
          <ul>
            <li>Read each question carefully.</li>
            <li>Ensure you answer all questions.</li>
            <li>Do not refresh the page during the exam.</li>
            {/* Add more instructions as needed */}
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
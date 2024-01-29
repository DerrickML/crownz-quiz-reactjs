import React, { useState, useEffect, useRef } from "react"; // Import useState
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { account } from "./appwriteConfig.js";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { showToast } from "./utilities/toastUtil.js";
import storageUtil from "./utilities/storageUtil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomNavbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ForgetPassword from "./components/ForgetPassword";
import Testing from "./components/Testing";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AllResults from "./components/AllResults";
import Exam from "./components/Exam";
import ExamPage from "./components/ExamPage";
import QuizResults from "./components/english/QuizResults";
import PasswordReset from "./components/PasswordReset";
import StudentDetails from "./components/StudentDetails";
import { fetchAndUpdateResults } from "./utilities/resultsUtil";
import { fetchAndProcessStudentData } from "./utilities/fetchStudentData";
import "./App.css";

function App() {
  const [navbarHeight, setNavbarHeight] = useState(0);

  // Check Network Status
  const isOnline = useNetworkStatus();
  const initialLoad = useRef(true);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    if (!isOnline) {
      showToast("You are offline. Check your internet connection.", "warning");
    } else {
      showToast("You are back online.", "success");
    }
  }, [isOnline]);

  // Use State for handling session information on login
  const [sessionInfo, setSessionInfo] = useState(() => {
    const savedSession = storageUtil.getItem("sessionInfo");
    if (savedSession) {
      const now = new Date();
      const expiryDate = new Date(savedSession.expire);

      if (now > expiryDate) {
        storageUtil.removeItem("sessionInfo");
        storageUtil.removeItem("userInfo");
        return null;
      }

      return savedSession;
    }

    return null;
  });

  // Use State for handling user information on login
  const [userInfo, setUserInfo] = useState(() => {
    return storageUtil.getItem("userInfo");
  });

  const handleLogin = async (sessionData, userData) => {
    const sessionDetails = {
      $id: sessionData.$id,
      userId: sessionData.userId,
      expire: sessionData.expire,
    };
    setSessionInfo(sessionDetails);
    storageUtil.setItem("sessionInfo", sessionDetails);

    const userDetails = {
      userId: sessionData.userId,
      firstName: userData.firstName,
      lastName: userData.lastName,
      otherName: userData.otherName,
      phone: userData.phone,
      email: userData.email,
      gender: userData.gender,
      schoolName: userData.schoolName,
      schoolAddress: userData.schoolAddress,
      educationLevel: userData.educationLevel,
      labels: userData.labels,
      kinID: userData.kinID,
      kinFirstName: userData.kinFirstName,
      kinLastName: userData.kinLastName,
      kinEmail: userData.kinEmail,
      kinPhone: userData.kinPhone,
    };

    console.log("User details on login", userDetails); //FOR Debugging purposes only
    setUserInfo(userDetails);
    storageUtil.setItem("userInfo", userDetails);
    if (userDetails.labels.includes("student")) {
      await fetchAndUpdateResults(userDetails.userId);
    }

    //Fetch all students' results linked to the next-of-kin and save to local storage
    if (userDetails.labels.includes("kin")) {
      await fetchAndProcessStudentData(userDetails.userId);
    }
  };

  const handleLogout = async () => {
    if (sessionInfo && sessionInfo.$id) {
      try {
        await account.deleteSession(sessionInfo.$id); //Clears the session on Client's and Appwrite's side
        console.log("Logged out successfully");
      } catch (error) {
        console.error("Logout failed", error);
      }
    } else {
      console.log("No active session to log out");
    }

    setSessionInfo(null);
    storageUtil.removeItem("sessionInfo"); // Clear session from localStorage on the clients side

    setUserInfo(null);
    storageUtil.removeItem("userInfo"); // Clear user info from localStorage on the clients side
  };

  return (
    <Router>
      <div className="App" style={{ "--navbarHeight": `${navbarHeight}px` }}>
        <CustomNavbar
          sessionInfo={sessionInfo}
          onLogout={handleLogout}
          setNavbarHeight={setNavbarHeight}
        />
        <div className="main-content">
          <Routes>
            <Route
              exact
              path="/"
              element={
                sessionInfo ? (
                  <Home sessionInfo={sessionInfo} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route
              path="/profile"
              element={sessionInfo ? <Profile /> : <Navigate to="/sign-in" />}
            />
            <Route
              path="/all-results"
              element={
                sessionInfo ? <AllResults /> : <Navigate to="/sign-in" />
              }
            />
            <Route
              path="/exam/:subject"
              element={
                sessionInfo ? (
                  <ExamWithSubject userInfo={userInfo} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route
              path="/exam-page"
              element={
                sessionInfo ? (
                  <ExamPage userInfo={userInfo} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route path="/quiz-results" element={<QuizResults />} />
            <Route path="/student-details" element={<StudentDetails />} />
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/password-reset" element={<PasswordReset />} />

            {/* Used to only test pages/routes/parts of the application */}
            <Route exact path="/testing" element={<Testing />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </Router>
  );
}

// Component to extract subject from URL and pass it to Exam
function ExamWithSubject(props) {
  let { subject } = useParams();
  return <Exam subject={subject} {...props} />;
}

export default App;

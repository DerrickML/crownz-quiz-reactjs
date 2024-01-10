import React, { useState, useEffect, useRef } from "react"; // Import useState
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink,
} from "react-router-dom";
import {
  account,
  databases,
  database_id,
  studentTable_id,
  nextOfKinTable_id,
  Query,
} from "./appwriteConfig.js";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { showToast } from "./utilities/toastUtil.js";
import storageUtil from "./utilities/storageUtil";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/Signup";
import ForgetPassword from "./components/ForgetPassword";
import Testing from "./components/Testing";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AllResults from "./components/AllResults";
import PasswordReset from "./components/PasswordReset";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";

function App() {
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

  const handleLogin = (sessionData, userData) => {
    const sessionDetails = {
      $id: sessionData.$id,
      userId: sessionData.userId,
      expire: sessionData.expire,
    };
    setSessionInfo(sessionDetails);
    storageUtil.setItem("sessionInfo", sessionDetails);

    const userDetails = {
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
    };
    console.log("User details on login", userDetails); //Debugging purposes only
    setUserInfo(userDetails);
    storageUtil.setItem("userInfo", userDetails);
  };

  const handleLogout = async () => {
    if (sessionInfo && sessionInfo.$id) {
      try {
        await account.deleteSession(sessionInfo.$id); //Clears the session on Appwrite's side
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
      <div className="App">
        <Navbar sessionInfo={sessionInfo} onLogout={handleLogout} />

        <div className="py-5 main-content">
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
                sessionInfo ? (
                  <AllResults userInfo={userInfo} />
                ) : (
                  <Navigate to="/sign-in" />
                )
              }
            />
            <Route path="/sign-in" element={<Login onLogin={handleLogin} />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route exact path="/testing" element={<Testing />} />
          </Routes>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </Router>
  );
}

export default App;

import React, { useEffect, useRef } from "react"; // Import useState
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
  Switch,
} from "react-router-dom";
import useNetworkStatus from "./hooks/useNetworkStatus";
import { Container } from "react-bootstrap";
import { showToast } from "./utilities/toastUtil.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppContent from "./components/navbar/AppContent";
import Footer from "./components/Footer";
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
import LinkedStudents from "./components/LinkedStudents";
import EditProfile from "./components/EditProfile";
import Answers from "./components/renderAnswer/Answers";
import PaymentResult from "./components/subscription/PaymentVerification"
import MTNMomo from "./components/subscription/MTNMomo";
import AirtelMoney from "./components/subscription/AirtelMoney";
import MobileMoney from "./components/subscription/MobileMoney";
import CardPayment from "./components/subscription/CardPayment";
import Receipt from "./components/subscription/Receipt.js";
import SelectPackage from "./components/subscription/SelectPackage";
import RegisteredStudents from "./pages/RegisteredStudents"
import NotFoundPage from './components/NotFoundPage.js'
import { AuthProvider, useAuth } from './context/AuthContext';
import { fetchStudents } from './utilities/fetchStudentData';
import './serviceWorkerListener.js';  // Service worker listener script
import "./App.css";

function PrivateRoute({ children }) {
  // console.log('APP.JS render')
  const { userInfo, sessionInfo } = useAuth();
  if (!sessionInfo) {
    // User is not logged in, redirect to login page
    return <Navigate to="/sign-in" />;
  }

  // User is logged in, allow access to the route
  return children;
}

// Component to extract subject from URL and pass it to Exam
function ExamWithSubject(props) {
  let { subject } = useParams();
  return <Exam subject={subject} {...props} />;
}

/**
 * Main component of the application.
 * Manages the routing and authentication of the app.
 * @returns {JSX.Element} The rendered App component.
 */
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

  //Send any unsent exam results data to the cloud database
  useEffect(() => {
    const triggerSync = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register('SYNC_EXAM_ANSWERS');  // Register the sync event
          // console.log('Sync event registered');
        } catch (error) {
          console.error('Error registering sync event:', error);
        }
      }
    };
    triggerSync();  // Trigger the sync event when the app loads
  }, []);  // Empty dependency array to ensure it runs once on mount

  return (
    <Router>

      <AuthProvider>
        <div
          className="App"
        >
          {/* Conditionally render Navbar if not on login page */}
          <AppContent />
          <div >
            <Routes>
              <Route
                exact
                path="/"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>}
              />
              <Route
                path="/all-results"
                element={
                  <PrivateRoute>
                    <AllResults />
                  </PrivateRoute>
                }
              />
              <Route
                path="/exam/:subject"
                element={
                  <PrivateRoute>
                    <ExamWithSubject />
                  </PrivateRoute>
                }
              />
              <Route
                path="/exam-page"
                element={<PrivateRoute>
                  <ExamPage />
                </PrivateRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={<PrivateRoute>
                  <EditProfile />
                </PrivateRoute>
                }
              />
              <Route
                path="/exam-results"
                element={<PrivateRoute>
                  <QuizResults />
                </PrivateRoute>
                }
              />
              <Route
                path="/student-details"
                element={
                  <PrivateRoute>
                    <StudentDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/linked-students"
                element={
                  <PrivateRoute>
                    <LinkedStudents />
                  </PrivateRoute>
                }
              />
              <Route path="/answers"
                element={
                  <PrivateRoute>
                    <Answers />
                  </PrivateRoute>
                }
              />
              <Route path="/select-package"
                element={
                  <PrivateRoute>
                    <SelectPackage />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/mtn-momo"
                element={
                  <PrivateRoute>
                    <MTNMomo />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/airtel-money"
                element={
                  <PrivateRoute>
                    <AirtelMoney />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/mobile-money"
                element={
                  <PrivateRoute>
                    <MobileMoney />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/card-payment"
                element={
                  <PrivateRoute>
                    <CardPayment />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/verification"
                element={
                  <PrivateRoute>
                    <PaymentResult />
                  </PrivateRoute>
                }
              />
              <Route path="/payment/receipt"
                element={
                  <PrivateRoute>
                    <Receipt />
                  </PrivateRoute>
                }
              />
              {/* ADMIN ROUTES */}
              <Route path="/registered-students"
                element={
                  <PrivateRoute>
                    <RegisteredStudents />
                  </PrivateRoute>
                }
              />
              {/* GLOBAL ROUTES */}
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path='*' element={<NotFoundPage />} />

              {/* Used to only test pages/routes/parts/component of the application */}
              <Route exact path="/testing" element={<Testing />} />

            </Routes>
          </div>
          {/* <Footer /> */}
        </div>
        {/* <Footer /> */}
      </AuthProvider>
      <ToastContainer position="top-center" />
      {/* <Footer /> */}
    </Router>

  );
}

export default App;

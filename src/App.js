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
import LinkedStudents from "./components/LinkedStudents";
import EditProfile from "./components/EditProfile";
import Answers from "./components/renderAnswer/Answers";
import PaymentResult from "./components/subscription/PaymentVerification"
import MTNMomo from "./components/subscription/MTNMomo";
import AirtelMoney from "./components/subscription/AirtelMoney";
import CardPayment from "./components/subscription/CardPaymentB";
import Receipt from "./components/subscription/Receipt.js";
import SelectPackage from "./components/subscription/SelectPackage";
import { AuthProvider, useAuth } from './context/AuthContext';
import "./App.css";

function PrivateRoute({ children }) {
  // console.log('APP.JS render')
  const { sessionInfo } = useAuth();
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

  return (
    <Router>

      <AuthProvider>
        <div className="App">
          {/* <CustomNavbar /> */}
          <div className="main-content" style={{ marginTop: "5px", width: "100%" }} >
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
                path="/quiz-results"
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
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="/password-reset" element={<PasswordReset />} />

              {/* Used to only test pages/routes/parts/component of the application */}
              <Route exact path="/testing" element={<Testing />} />

            </Routes>
          </div>
        </div>

      </AuthProvider>
      <ToastContainer position="top-center" />
    </Router>

  );
}

export default App;

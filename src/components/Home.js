// Home.js
import React from "react";

function Home({ sessionInfo, onLogout }) {
  // Receive onLogout as a prop
  return (
    <div>
      <h1>Welcome to CrownzCom</h1>
      <p>Session ID: {sessionInfo.$id}</p>
      <p>User ID: {sessionInfo.userId}</p>
      {/* ... */}
      <button onClick={onLogout}>Logout</button> {/* Use the onLogout prop */}
    </div>
  );
}

export default Home;

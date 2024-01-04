import React, { useState } from "react";
import "../animations.css";

function Testing() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div>
        <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
        <div
          className={`card-body-collapsible`}
          style={{ maxHeight: isOpen ? "500px" : "0px" }}
        >
          <p>Your content goes here...</p>
          <p>Your content goes here...</p>
          <p>Your content goes here...</p>
          <p>Your content goes here...</p>
        </div>

        <div className={`fade-animation ${isVisible ? "visible" : "hidden"}`}>
          Your content here...
        </div>
      </div>
      {/*  */}
      <div className={`fade-animation ${isVisible ? "visible" : "hidden"}`}>
        Your content here...
      </div>
    </>
  );
}

export default Testing;

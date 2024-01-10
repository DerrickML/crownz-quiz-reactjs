import React, { useState } from "react";
import { DndProvider } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  WORD: "word",
};

// Draggable word component
const DraggableWord = ({ id, text, moveWord }) => {
  const [, drag] = useDrag({
    type: ItemTypes.WORD,
    item: { id },
  });
  // Additional implementation here
  return <div ref={drag}>{text}</div>;
};

// Droppable sentence component
const SentenceDropZone = ({ sentence, moveWord }) => {
  const [, drop] = useDrop({
    accept: ItemTypes.WORD,
    // Additional implementation here
  });
  return (
    <div ref={drop}>
      {sentence.map((word, index) => (
        <DraggableWord
          key={word.id}
          id={word.id}
          text={word.text}
          moveWord={moveWord}
        />
      ))}
    </div>
  );
};

// Main sentence reconstruction component
const SentenceReconstruction = ({ initialSentence }) => {
  const [sentence, setSentence] = useState(
    initialSentence.split(" ").map((word, index) => ({
      id: index,
      text: word,
    }))
  );

  const moveWord = (dragIndex, hoverIndex) => {
    // Logic to reorder words
  };

  return (
    <DndProvider options={HTML5toTouch}>
      <SentenceDropZone sentence={sentence} moveWord={moveWord} />
      {/* Additional UI and logic here */}
    </DndProvider>
  );
};

export default SentenceReconstruction;

import React, { useState, useCallback } from "react";
import { useQuiz } from "../../context/QuizContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ListGroup, Badge } from "react-bootstrap";
import DeferredDroppable from "../DeferredDroppable";

const AlphabeticalOrdering = ({ data }) => {
  const { updateUserAnswer } = useQuiz();
  const [words, setWords] = useState(data.questions[0].words_to_drag || []);

  // Function to handle the drag end event
  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const newWords = Array.from(words);
      const [reorderedWord] = newWords.splice(result.source.index, 1);
      newWords.splice(result.destination.index, 0, reorderedWord);

      setWords(newWords);
      updateUserAnswer(data.id, newWords);
    },
    [words, updateUserAnswer, data.id]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppableWords" direction="horizontal">
        {(provided) => (
          <ListGroup
            horizontal
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="list-group-horizontal"
          >
            {words.map((word, index) => (
              <Draggable key={word} draggableId={word} index={index}>
                {(provided, snapshot) => (
                  <ListGroup.Item
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`d-inline-flex ${
                      snapshot.isDragging ? "bg-light" : ""
                    }`}
                    style={{
                      ...provided.draggableProps.style,
                      userSelect: "none", // Prevents text selection during drag
                      padding: "0.5rem",
                      margin: "0.5rem",
                      backgroundColor: "#fff", // Sets the background color to white
                      borderColor: "#ccc", // Sets the border color
                    }}
                  >
                    <Badge pill variant="secondary" className="px-3 py-2">
                      {word}
                    </Badge>
                  </ListGroup.Item>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ListGroup>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default AlphabeticalOrdering;

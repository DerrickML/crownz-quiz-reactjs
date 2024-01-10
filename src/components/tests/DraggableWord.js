import React from "react";
import { useDrag } from "react-dnd";

const DraggableWord = ({ id, text }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "WORD",
    item: { id, text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <span ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      {text}
    </span>
  );
};

export default DraggableWord;

import React from "react";
import { useDrop } from "react-dnd";

const DropZone = ({ id, onDrop }) => {
  const [, drop] = useDrop(() => ({
    accept: "WORD",
    drop: (item) => onDrop(id, item),
  }));

  return (
    <div
      ref={drop}
      style={{ minHeight: "20px", minWidth: "50px", border: "1px solid gray" }}
    ></div>
  );
};

export default DropZone;

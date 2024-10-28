import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import useImage from "use-image";

const FontList = () => {
  return (
    <>
      <option value="Arial">Arial</option>
      <option value="Arial Black">Arial Black</option>
      <option value="Comic Sans MS">Comic Sans MS</option>
      <option value="Courier New">Courier New</option>
      <option value="Georgia">Georgia</option>
      <option value="Garamond">Garamond</option>
      <option value="Helvetica">Helvetica</option>
      <option value="Impact">Impact</option>
      <option value="Lucida Console">Lucida Console</option>
      <option value="Monaco">Monaco</option>
      <option value="Open Sans">Open Sans</option>
      <option value="Roboto">Roboto</option>
      <option value="Tahoma">Tahoma</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Trebuchet MS">Trebuchet MS</option>
      <option value="Verdana">Verdana</option>
      <option value="Webdings">Webdings</option>
      <option value="Wingdings">Wingdings</option>
      <option value="Segoe UI">Segoe UI</option>
      <option value="Arial Unicode MS">Arial Unicode MS</option>
      <option value="Calibri">Calibri</option>
      <option value="Cambria">Cambria</option>
      <option value="Georgia">Georgia</option>
      <option value="Frank Ruhl Libre">Frank Ruhl Libre</option>
      <option value="Poppins">Poppins</option>
      <option value="Montserrat">Montserrat</option>
      <option value="Lora">Lora</option>
      <option value="Droid Sans">Droid Sans</option>
    </>
  );
};

const DesignPage = () => {
  const [texts, setTexts] = useState([]); // Store multiple text objects
  console.log(texts)
  const [textOptions, setTextOptions] = useState({
    text: "Your Text Here",
    color: "#000000",
    fontSize: 24,
    align: "center",
    fontFamily: "Arial",
    fontWeight: "normal",
    width: 200, // Default width for wrapping
    height: 50,
  });
  const [selectedId, setSelectedId] = useState(null); // Track selected text ID for Transformer

  const stageRef = useRef();
  const transformerRef = useRef();
  const [image] = useImage("/templatess.png");
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Set canvas stage size according to image's aspect ratio
  useEffect(() => {
    if (image) {
      const aspectRatio = 2560 / 1810;
      const screenHeight = window.innerHeight * (5 / 6);
      setImageDimensions({
        width: screenHeight * aspectRatio,
        height: screenHeight,
      });
    }
  }, [image]);

  // Handle text option changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextOptions((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setTexts((prev) =>
      prev.map((t) => (t.id === selectedId   ? { ...t, ...textOptions } : t))
    );
  }, [textOptions]);

  // Add new text to the canvas
  const addText = () => {
    setTexts((prev) => [
      ...prev,
      {
        id: Date.now(), // Unique ID for each text
        ...textOptions,
        x: imageDimensions.width / 2,
        y: imageDimensions.height / 2,
      },
    ]);
    setTextOptions({
      align: "center",
      text: "Your Text Here",
      color: "#000000",
      fontSize: 24,
      fontFamily: "Arial",
      fontWeight: "normal",
      width: 200, // Default width for wrapping
      height: 50,
    }); // Reset text input
  };

  // Update existing text properties
  const updateText = (id) => {
    setTexts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...textOptions } : t))
    );
  };

  // Delete text from the canvas
  const deleteText = (id) => {
    setTexts((prev) => prev.filter((t) => t.id !== id));
    setSelectedId(null); // Deselect when deleting
  };

  // Attach transformer to the selected text
  useEffect(() => {
    if (transformerRef.current && selectedId) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);

      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      } else {
        transformerRef.current.nodes([]);
      }
    }
    if (selectedId == null) {
      transformerRef.current.nodes([]);
    }
  }, [selectedId, texts]); // Re-run when selectedId or texts change

  // Handle text drag and resize events
  const handleDragEnd = (e, id) => {
    const { x, y } = e.target.position();
    setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, x, y } : t)));
  };

  const handleSelect = (selectedText) => {
    setTextOptions({
      text: selectedText.text,
      width: selectedText.width,
      height: selectedText.height,
      fontFamily: selectedText.fontFamily,
      fontSize: selectedText.fontSize,
      color: selectedText.color,
      fontWeight: selectedText.fontWeight,
    });
    setSelectedId(selectedText.id);
  };

  const handleTransformEnd = (e, id) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    setTextOptions({
      ...textOptions,
      height: textOptions.height * scaleY,
      width: textOptions.width * scaleX,
    });
    setTexts((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              x: node.x(),
              y: node.y(),
              scaleX: 1,
              scaleY: 1,
              height: t.height * scaleY,
              width: t.width * scaleX,
            }
          : t
      )
    );
    node.scaleX(1);
    node.scaleY(1);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Text Options</h2>

        <input
          type="text"
          name="text"
          value={textOptions.text}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Edit Text"
        />

        <label>Color:</label>
        <input
          type="color"
          name="color"
          value={textOptions.color}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label>Font Size:</label>
        <input
          type="number"
          name="fontSize"
          value={textOptions.fontSize}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <label>Text Align:</label>
        <select
          name="align"
          value={textOptions.align}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="center">Center</option>
          <option value="left">Left</option>
        </select>

        <label>Font Family:</label>
        <select
          name="fontFamily"
          value={textOptions.fontFamily}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <FontList />
        </select>

        <label>Font Weight:</label>
        <select
          name="fontWeight"
          value={textOptions.fontWeight}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          {/* Add Options Here */}
          <option value="Lighter">Lighter</option>
          <option value="Normal">Normal</option>
          <option value="Bold">Bold</option>
          <option value="Bolder">Bolder</option>
        </select>

        <button
          onClick={addText}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Text
        </button>

        {/* List of added texts */}
        <h3 className="text-md font-semibold mt-4">Added Texts</h3>
        <ul className="space-y-2">
          {texts.map((text) => (
            <li
              key={text.id}
              onClick={() => {
                handleSelect(text);
              }}
              className={`flex justify-between items-center p-2 border rounded ${
                selectedId === text.id && "border-red-800"
              }`}
            >
              <span>{text.text}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateText(text.id)}
                  className="text-blue-500 hover:underline"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteText(text.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Canvas Panel */}
      <div className="flex-1 flex justify-center items-center bg-gray-200">
        <Stage
          ref={stageRef}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{ border: "1px solid #ddd", backgroundColor: "white" }}
          onMouseDown={(e) => {
            // // Deselect text when clicking outside
            if (e.target === e.target.getStage()) {
              setSelectedId(null);
            }
          }}
        >
          <Layer>
            {/* Background Template Image */}
            <KonvaImage
              image={image}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />

            {/* Render all added text elements */}
            {texts.map((text) => (
              <Text
                verticalAlign="left"
                align={text.align}
                key={text.id}
                id={text.id.toString()}
                text={text.text}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily}
                fill={text.color}
                fontStyle={text.fontWeight}
                draggable
                x={text.x}
                y={text.y}
                height={text.height}
                width={text.width}
                onClick={() => handleSelect(text)}
                onTap={() => handleSelect(text)}
                onDragEnd={(e) => handleDragEnd(e, text.id)} // Handle drag end event
                onTransformEnd={(e) => handleTransformEnd(e, text.id)} // Handle transform end event
              />
            ))}

            {/* Transformer for resizing text */}
            <Transformer
              anchorCornerRadius={10}
              anchorFill="white"
              ref={transformerRef}
              // Allow horizontal resizing
            />
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DesignPage;

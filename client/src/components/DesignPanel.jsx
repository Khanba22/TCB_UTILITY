import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";

const FontList = () => {
  const fonts = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Garamond",
    "Helvetica",
    "Impact",
    "Lucida Console",
    "Monaco",
    "Open Sans",
    "Roboto",
    "Tahoma",
    "Times New Roman",
    "Trebuchet MS",
    "Verdana",
    "Webdings",
    "Wingdings",
    "Segoe UI",
    "Arial Unicode MS",
    "Calibri",
    "Cambria",
    "Frank Ruhl Libre",
    "Poppins",
    "Montserrat",
    "Lora",
    "Droid Sans",
  ];

  return (
    <>
      {fonts.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
    </>
  );
};

const DesignPage = () => {
  const [texts, setTexts] = useState([]); // Store multiple text objects
  const [image, setImage] = useState(null);
  const [background, setBackground] = useState(null);
  const [textOptions, setTextOptions] = useState({
    text: "Your Text Here",
    color: "#000000",
    fontSize: 24,
    align: "center",
    fontFamily: "Arial",
    fontWeight: "normal",
    verticalAlign: "middle",
    width: 200, // Default width for wrapping
    height: 50,
  });
  const [selectedId, setSelectedId] = useState(null); // Track selected text ID for Transformer

  const stageRef = useRef();
  const transformerRef = useRef();
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  // Set canvas stage size according to image's aspect ratio
  useEffect(() => {
    if (image) {
      if (image.naturalHeight > image.naturalWidth) {
        const aspectRatio = 1 / 1.414;
        const screenHeight = window.innerHeight * (5 / 6);
        setImageDimensions({
          width: screenHeight * aspectRatio,
          height: screenHeight,
        });
      } else {
        const aspectRatio = 2560 / 1810;
        const screenHeight = window.innerHeight * (5 / 6);
        setImageDimensions({
          width: screenHeight * aspectRatio,
          height: screenHeight,
        });
      }
    }
  }, [image]);

  // Handle text option changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextOptions((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setTexts((prev) =>
      prev.map((t) => (t.id === selectedId ? { ...t, ...textOptions } : t))
    );
  }, [textOptions]);

  // Add new text to the canvas
  const addText = () => {
    const id = Date.now();
    setTexts((prev) => [
      ...prev,
      {
        id: id, // Unique ID for each text
        ...textOptions,
        x: imageDimensions.width / 2,
        y: imageDimensions.height / 2,
      },
    ]);
    setSelectedId(id);
    setTextOptions({
      align: "center",
      text: "Your Text Here",
      verticalAlign: "middle",
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
      align: selectedText.align,
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

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackground(file);
      const image = new Image();
      image.src = URL.createObjectURL(file);
      setImage(image); // Assuming setImage is a hook to store the image
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData();
    formData.append("texts", JSON.stringify(texts));
    formData.append("image", background);

    try {
      const response = await fetch("http://localhost:4000/design/store", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert("Upload Successful");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading the Data");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-white shadow-lg space-y-4">
        <h2 className="text-lg font-semibold">Text Options</h2>

        <label>Background:</label>
        <input
          type="file"
          accept="image/*"
          name="background"
          onChange={handleFile}
          className="w-full p-2 border rounded"
        />

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
          <option value="right">Right</option>
        </select>
        <label>Vertical Align:</label>
        <select
          name="verticalAlign"
          value={textOptions.verticalAlign}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="middle">Middle</option>
          <option value="top">Top</option>
          <option value="bottom">Bottom</option>
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
      <div className="flex-1 flex flex-col justify-center items-center bg-gray-200">
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
                verticalAlign={text.verticalAlign}
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
        <button
          onClick={handleUpload}
          className="w-1/6 my-3 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DesignPage;

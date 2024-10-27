import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

const DesignPage = () => {
  const [texts, setTexts] = useState([]); // Store multiple text objects
  const [textOptions, setTextOptions] = useState({
    text: 'Your Text Here',
    color: '#000000',
    fontSize: 24,
    fontFamily: 'Arial',
    fontWeight: 'normal',
  });

  const stageRef = useRef();
  const [image] = useImage('/template.gif');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // Set canvas stage size according to image's aspect ratio
  useEffect(() => {
    if (image) {
      const aspectRatio = image.width / image.height;
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
    setTextOptions(prev => ({ ...prev, [name]: value }));
  };

  // Add new text to the canvas
  const addText = () => {
    setTexts(prev => [
      ...prev,
      {
        id: Date.now(), // Unique ID for each text
        ...textOptions,
        x: imageDimensions.width / 2,
        y: imageDimensions.height / 2,
      },
    ]);
    setTextOptions({ ...textOptions, text: 'Your Text Here' }); // Reset text input
  };

  // Update existing text properties
  const updateText = (id) => {
    setTexts(prev => prev.map(t => (t.id === id ? { ...t, ...textOptions } : t)));
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

        <label>Font Family:</label>
        <select
          name="fontFamily"
          value={textOptions.fontFamily}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>

        <label>Font Weight:</label>
        <select
          name="fontWeight"
          value={textOptions.fontWeight}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="bolder">Bolder</option>
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
          {texts.map(text => (
            <li key={text.id} className="flex justify-between items-center p-2 border rounded">
              <span>{text.text}</span>
              <button 
                onClick={() => updateText(text.id)} 
                className="text-blue-500 hover:underline"
              >
                Update
              </button>
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
          style={{ border: '1px solid #ddd', backgroundColor: 'white' }}
        >
          <Layer>
            {/* Background Template Image */}
            <KonvaImage image={image} width={imageDimensions.width} height={imageDimensions.height} />
            {/* Render all added text elements */}
            {texts.map(text => (
              <Text
                key={text.id}
                text={text.text}
                fontSize={text.fontSize}
                fontFamily={text.fontFamily}
                fill={text.color}
                fontStyle={text.fontWeight}
                draggable
                x={text.x}
                y={text.y}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default DesignPage;

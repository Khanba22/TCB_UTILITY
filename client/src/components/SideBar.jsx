import React from 'react';

const Sidebar = ({ textOptions, setTextOptions }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextOptions(prev => ({ ...prev, [name]: value }));
  };

  return (
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
    </div>
  );
};

export default Sidebar;

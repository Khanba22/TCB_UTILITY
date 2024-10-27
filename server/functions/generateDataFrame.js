function generateDataFrame(obj) {
  const keys = Object.keys(obj);
  const keyMap = {};

  const dataFrame = [];
  keys.forEach((keyValue, index) => {
    keyMap[keyValue] = index;
    dataFrame.push(obj[keyValue]);
  });

  // Create the DataFrame object
  const dataFrameObj = {
    keys: keyMap,
    dataFrame: dataFrame,
  };

  Object.defineProperty(dataFrameObj, "getRows", {
    value: function () {
      const keys = Object.keys(this.keys);
      const length = this.dataFrame[0].length; // Assuming all arrays have the same length
      const result = [];

      const headings = Object.keys(this.keys).map(key=>key)
      result.push(headings)

      for (let i = 0; i < length; i++) {
        const row = keys.map((key,index) => this.dataFrame[index][i]);
        result.push(row);
      }

      return result;
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });

  // Add a custom getter for dynamic key access
  Object.defineProperty(dataFrameObj, "getValue", {
    value: function (key) {
      const index = this.keys[key]; // Find the index of the key
      return index !== undefined ? this.dataFrame[index] : undefined; // Return the value at that index
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });
  // Example Usage
  // const df = createDataFrame(jsonObject)
  // df.getValue(row)
  return dataFrameObj;
}

module.exports = { generateDataFrame };

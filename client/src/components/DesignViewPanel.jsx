import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Text, Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";
import { jsPDF } from "jspdf";
import data from "../data/templateData.json";

const DesignViewPanel = () => {
  const [texts, setTexts] = useState(data); // Store multiple text objects
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

  // Function to download the stage as a PDF
  const downloadPDF = () => {
    const stage = stageRef.current;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [stage.width(), stage.height()],
    });

    stage.toDataURL({
      mimeType: "image/png",
      callback: (dataUrl) => {
        pdf.addImage(dataUrl, "PNG", 0, 0, stage.width(), stage.height());
        pdf.save("stage.pdf");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Canvas Panel */}
      <div className="flex-1 flex justify-center items-center bg-gray-200">
        <Stage
          ref={stageRef}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{ border: "1px solid #ddd", backgroundColor: "white" }}
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
              />
            ))}
            <Transformer
              anchorCornerRadius={10}
              anchorFill="white"
              ref={transformerRef}
            />
          </Layer>
        </Stage>
      </div>

      {/* Download Button */}
      <div className="p-4">
        <button
          onClick={downloadPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default DesignViewPanel;

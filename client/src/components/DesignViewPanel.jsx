import React, { useState, useEffect, useRef } from "react";
import {
  Stage,
  Layer,
  Text,
  Image as KonvaImage,
  Transformer,
} from "react-konva";
import { jsPDF } from "jspdf";

const DesignViewPanel = () => {
  const [texts, setTexts] = useState([]);
  const stageRef = useRef();
  const [background, setBackground] = useState();
  const transformerRef = useRef();
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const fetchCertificate = async () => {
    try {
      const response = await fetch("http://localhost:4000/design/retrieve");
      const data = await response.json();

      // Set the texts from the response
      setTexts(data.texts);

      // Handle the file URL and the image object
      const file = data.image; // Assuming this is the URL of the image
      const imageObj = data.imageObj; // The object containing base64 image data

      // If the file URL is available
      if (file) {
        const img = new Image();
        img.src = file; // Set the image source to the file URL
        img.onload = () => {
          // setImage(img); // Update the image state with the loaded image
          const url = file.split("/").pop(); // Get the image file name
          setBackground(url); // Set background to the image name
          console.log(file);
        };
      }

      // If the image object exists
      if (imageObj) {
        const { content, type } = imageObj;

        // Convert base64 to Blob
        const byteCharacters = atob(content); // Decode base64 string
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Create a Blob from the byte array
        const blob = new Blob([byteArray], { type });
        // Create a File object from the Blob
        const file = new File([blob], "downloaded-image.png", { type });
        if (file) {
          setBackground(file);
          const image = new Image();
          image.src = URL.createObjectURL(file);
          setImage(image); // Assuming setImage is a hook to store the image
        }
        // Optionally, set the File object to a state if needed
        // setImageFile(fileObj); // Uncomment if you need to store the file object
      }
    } catch (error) {
      console.error("Error retrieving data:", error);
      alert("Failed To Retrieve");
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, []);

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

  const downloadPDF = async () => {
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
        pdf.save("certificate.pdf");
      },
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex justify-center items-center bg-gray-200">
        <Stage
          ref={stageRef}
          width={imageDimensions.width}
          height={imageDimensions.height}
          style={{ border: "1px solid #ddd", backgroundColor: "white" }}
        >
          <Layer>
            <KonvaImage
              image={image}
              width={imageDimensions.width}
              height={imageDimensions.height}
            />

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

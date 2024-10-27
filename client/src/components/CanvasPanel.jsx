import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

const CanvasPanel = ({ textOptions }) => {
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

  return (
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
          {/* Draggable Text */}
          <Text
            text={textOptions.text}
            fontSize={textOptions.fontSize}
            fontFamily={textOptions.fontFamily}
            fill={textOptions.color}
            fontStyle={textOptions.fontWeight}
            draggable
            x={imageDimensions.width / 2}
            y={imageDimensions.height / 2}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default CanvasPanel;

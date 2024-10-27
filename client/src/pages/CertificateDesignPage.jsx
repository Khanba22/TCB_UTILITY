import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import DesignPanel from "../components/DesignPanel";


const CertificateDesignPage = () => {
  const [texts, setTexts] = useState([]);
  const [selectedText, setSelectedText] = useState({});

  return (
    <div className="h-screen w-screen flex justify-between pl-10">
      <DesignPanel/>
    </div>
  );
};

export default CertificateDesignPage;

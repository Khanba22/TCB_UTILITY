import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Text } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";
import DesignPanel from "../components/DesignPanel";
import CSVHandler from "../components/CSVHandler";

const CertificateDesignPage = () => {
  const [background, setBackground] = useState(null);
  const [texts, setTexts] = useState([]);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [templateId, setTemplateId] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!background) {
      alert("Please Select A background");
      return;
    }

    const formData = new FormData();
    formData.append("texts", JSON.stringify(texts));
    formData.append("image", background);

    try {
      const response = await fetch(
        `http://localhost:4000/design/save/${templateId}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status !== 200) {
        alert("Upload Failed");
        return;
      }

      const result = await response.json();
      setTemplateId(result.data._id); // Use returned ID for future updates
      alert("Upload Successful");
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading the Data");
    }
  };

  return (
    <>
      <div className="min-h-screen w-screen flex justify-between pl-10">
        <DesignPanel
          templateId={templateId}
          setTemplateId={setTemplateId}
          background={background}
          setBackground={setBackground}
          texts={texts}
          handleUpload={handleUpload}
          setTexts={setTexts}
        />
        <CSVHandler
          data={data}
          error={error}
          setData={setData}
          setError={setError}
        />
      </div>
      <button>
        Generate Certiificate
      </button>
    </>
  );
};

export default CertificateDesignPage;

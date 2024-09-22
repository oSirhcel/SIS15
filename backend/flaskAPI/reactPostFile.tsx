import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [getResponse, setGetResponse] = useState("");

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setUploadStatus("File uploaded successfully!");
      } else {
        setUploadStatus("Failed to upload file.");
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      setUploadStatus("Error uploading file.");
    }
  };

  // Handle GET request
  const handleGetRequest = async () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [getResponse, setGetResponse] = useState("");

  // Handle file selection
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    // Handle file upload
    const handleFileUpload = async () => {
        if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
        }

    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.get('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });  // Replace with your actual endpoint
      setGetResponse(response.data);  // Assuming the response is JSON or plain text
    } catch (error) {
      console.error("There was an error fetching the data!", error);
      setGetResponse("Error fetching data.");
    }
  };

  return (
    <div>
      <h2>File Upload and Get Response</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      
      <hr />
      
      <button onClick={handleGetRequest}>Get Data</button>
      {getResponse && <p>Response: {getResponse}</p>}
    </div>
  );
};

export default FileUpload;

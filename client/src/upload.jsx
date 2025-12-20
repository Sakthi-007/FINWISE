import React, { useState } from 'react';
import axios from 'axios';

const BankStatementUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setFile(null);
      setError('Please select a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing the PDF');
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Bank Statement Upload</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange} 
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button 
          type="submit" 
          disabled={!file || loading}
        >
          {loading ? 'Processing...' : 'Process Statement'}
        </button>
      </form>

      {loading && <p>Processing your PDF, please wait...</p>}

      
    </div>
  );
};

export default BankStatementUpload;
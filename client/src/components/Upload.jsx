import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaUpload, 
  FaFilePdf, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaCloudUploadAlt,
  FaSpinner
} from 'react-icons/fa'
import { uploadBankStatement } from '../api'
import './Upload.css'

export default function Upload() {
  const [uploadState, setUploadState] = useState('idle') // idle, uploading, processing, success, error
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      setErrorMessage('Please upload only PDF files (max 10MB)')
      setUploadState('error')
      return
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      setUploadState('idle')
      setErrorMessage('')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a PDF file first')
      setUploadState('error')
      return
    }

    try {
      setUploadState('uploading')
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      const result = await uploadBankStatement(selectedFile, (progress) => {
        setUploadProgress(progress)
      })

      clearInterval(progressInterval)
      setUploadProgress(100)
      setUploadState('processing')

      // Simulate processing time
      setTimeout(() => {
        setUploadState('success')
        // Redirect to dashboard after success
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }, 3000)

    } catch (error) {
      setUploadState('error')
      setErrorMessage(error.message || 'Failed to upload bank statement')
    }
  }

  const resetUpload = () => {
    setUploadState('idle')
    setSelectedFile(null)
    setUploadProgress(0)
    setErrorMessage('')
  }

  return (
    <div className="upload-container">
      <motion.div 
        className="upload-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="upload-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          >
            <FaCloudUploadAlt className="upload-icon" />
          </motion.div>
          <h1>Upload Bank Statement</h1>
          <p>Upload your bank statement PDF to automatically categorize and analyze your transactions</p>
        </div>

        <AnimatePresence mode="wait">
          {uploadState === 'idle' && (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="upload-form"
            >
              {/* Dropzone */}
              <div 
                {...getRootProps()} 
                className={`dropzone ${isDragActive ? 'active' : ''} ${selectedFile ? 'has-file' : ''}`}
              >
                <input {...getInputProps()} />
                <div className="dropzone-content">
                  {selectedFile ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="file-preview"
                    >
                      <FaFilePdf className="file-icon" />
                      <div className="file-info">
                        <p className="file-name">{selectedFile.name}</p>
                        <p className="file-size">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="dropzone-placeholder"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FaUpload className="upload-placeholder-icon" />
                      <h3>
                        {isDragActive 
                          ? 'Drop your PDF here!' 
                          : 'Drag & drop your PDF here'
                        }
                      </h3>
                      <p>or click to browse files</p>
                      <div className="file-requirements">
                        <span>• PDF files only</span>
                        <span>• Max size: 10MB</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="upload-actions">
                {selectedFile && (
                  <motion.button
                    className="btn-reset"
                    onClick={resetUpload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Choose Different File
                  </motion.button>
                )}
                
                <motion.button
                  className="btn-upload"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  whileHover={{ scale: selectedFile ? 1.02 : 1 }}
                  whileTap={{ scale: selectedFile ? 0.98 : 1 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <FaUpload />
                  Upload & Process
                </motion.button>
              </div>
            </motion.div>
          )}

          {(uploadState === 'uploading' || uploadState === 'processing') && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="upload-progress"
            >
              <div className="progress-content">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="progress-spinner"
                >
                  <FaSpinner />
                </motion.div>
                
                <h2>
                  {uploadState === 'uploading' ? 'Uploading...' : 'Processing...'}
                </h2>
                
                <p>
                  {uploadState === 'uploading' 
                    ? 'Uploading your bank statement' 
                    : 'Analyzing and categorizing transactions with AI'
                  }
                </p>

                <div className="progress-bar">
                  <motion.div 
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="progress-percentage">
                  {uploadState === 'uploading' ? `${uploadProgress}%` : 'Processing...'}
                </div>
              </div>
            </motion.div>
          )}

          {uploadState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="upload-success"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="success-icon"
              >
                <FaCheckCircle />
              </motion.div>
              
              <h2>Upload Successful!</h2>
              <p>Your bank statement has been processed successfully. Redirecting to dashboard...</p>
              
              <motion.div
                className="success-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="detail-item">
                  <span>File:</span>
                  <span>{selectedFile?.name}</span>
                </div>
                <div className="detail-item">
                  <span>Status:</span>
                  <span className="status-complete">Complete</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {uploadState === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="upload-error"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                className="error-icon"
              >
                <FaExclamationCircle />
              </motion.div>
              
              <h2>Upload Failed</h2>
              <p>{errorMessage}</p>
              
              <motion.button
                className="btn-retry"
                onClick={resetUpload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Try Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
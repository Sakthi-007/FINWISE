import React from 'react'
import { motion } from 'framer-motion'
import { FaSpinner, FaBrain, FaChartLine, FaCheckCircle } from 'react-icons/fa'
import './LoadingScreen.css'

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* Main Loading Animation */}
        <motion.div 
          className="loading-animation"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="loading-circle"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <FaSpinner className="loading-icon" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2 
          className="loading-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Processing Your Bank Statement
        </motion.h2>

        <motion.p 
          className="loading-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Our AI is analyzing your transactions and categorizing them for you
        </motion.p>

        {/* Processing Steps */}
        <motion.div 
          className="processing-steps"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="step">
            <motion.div 
              className="step-icon processing"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <FaBrain />
            </motion.div>
            <div className="step-content">
              <h4>AI Analysis</h4>
              <p>Reading and understanding your PDF</p>
            </div>
          </div>

          <div className="step">
            <motion.div 
              className="step-icon processing"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            >
              <FaChartLine />
            </motion.div>
            <div className="step-content">
              <h4>Categorization</h4>
              <p>Organizing transactions by category</p>
            </div>
          </div>

          <div className="step">
            <motion.div 
              className="step-icon waiting"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            >
              <FaCheckCircle />
            </motion.div>
            <div className="step-content">
              <h4>Finalization</h4>
              <p>Preparing your dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Dots */}
        <motion.div 
          className="progress-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="dot"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
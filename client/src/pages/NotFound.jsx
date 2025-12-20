import React from 'react';
import { Link } from 'react-router';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
    backgroundColor: 'white',
    color: 'white',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '10rem',
    margin: '0',
    color: '#007bff',
    textShadow: '2px 2px 4px #000000',
  },
  message: {
    fontSize: '1.5rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
  },
};

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
      <Link href="/" style={styles.button}>Go Back Home</Link>
    </div>
  );
};

export default NotFound;
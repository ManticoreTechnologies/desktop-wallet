import React from 'react';
import './Loading.css';
import logo from '../../assets/manticore.png';

interface LoadingProps {
  progress: number;
  message: string;
}

const Loading: React.FC<LoadingProps> = ({ progress, message }) => {
  const roundedProgress = Math.round(progress);
  return (
    <div className="loading-container">
      <img src={logo} alt="Loading Logo" className="loading-logo" />
      <h1>{message} {roundedProgress}%</h1>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${roundedProgress}%` }}></div>
      </div>
    </div>
  );
};

export default Loading;
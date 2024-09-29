import React, { useState } from 'react';
import './Sidebar.css';
import logo from '../assets/manticore.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaPaperPlane, FaInbox, FaList, FaPlusCircle, FaExchangeAlt, FaCogs, FaLock } from 'react-icons/fa';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Toggle Button */}
      <button className="toggle-button" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        {isOpen ? (
          // Close icon (an arrow pointing left)
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          // Hamburger menu icon
          <svg width="24" height="24" viewBox="0 0 24 24">
            <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" />
            <line x1="3" y1="18" x2="21" y2="18" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <div  className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
        <nav className="sidebar-nav">
          <div className="sidebar-header">
            <a href="https://manticore.exchange" target="_blank" rel="noopener noreferrer">
              <img src={logo} alt="Logo" className="sidebar-logo" />
            </a>
          </div>
          <ul className="sidebar-links">
            <li className={isActive('/overview') ? 'active' : ''}>
              <a href="#overview" onClick={() => navigate('/overview')}>
                <FaHome />
                <span>Overview</span>
              </a>
            </li>
            <li className={isActive('/send') ? 'active' : ''}>
              <a href="#send" onClick={() => navigate('/send')}>
                <FaPaperPlane />
                <span> Send</span>
              </a>
            </li>
            <li className={isActive('/receive') ? 'active' : ''}>
              <a href="#receive" onClick={() => navigate('/receive')}>
                <FaInbox />
                <span> Receive</span>
              </a>
            </li>
            <li className={isActive('/transactions') ? 'active' : ''}>
              <a href="#transactions" onClick={() => navigate('/transactions')}>
                <FaList />
                <span> Transactions</span>
              </a>
            </li>
            <li className={isActive('/createAssets') ? 'active' : ''}>
              <a href="#createAssets" onClick={() => navigate('/createAssets')}>
                <FaPlusCircle />
                <span> Create Assets</span>
              </a>
            </li>
            <li className={isActive('/transferAssets') ? 'active' : ''}>
              <a href="#transferAssets" onClick={() => navigate('/transferAssets')}>
                <FaExchangeAlt />
                <span> Transfer Assets</span>
              </a>
            </li>
            <li className={isActive('/manageAssets') ? 'active' : ''}>
              <a href="#manageAssets" onClick={() => navigate('/manageAssets')}>
                <FaCogs />
                <span> Manage Assets</span>
              </a>
            </li>
            <li className={isActive('/restrictedAssets') ? 'active' : ''}>
              <a href="#restrictedAssets" onClick={() => navigate('/restrictedAssets')}>
                <FaLock />
                <span> Restricted Assets</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
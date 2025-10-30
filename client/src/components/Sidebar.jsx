import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FaHome, 
  FaUpload, 
  FaTable, 
  FaSignOutAlt,
  FaChartPie,
  FaWallet,
  FaFileAlt
} from 'react-icons/fa'
import './Sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Dummy logout functionality
    alert('Logout clicked! (This is a dummy button)')
  }

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard', color: '#4F46E5' },
    { path: '/upload', icon: FaUpload, label: 'Upload', color: '#059669' },
    { path: '/transactions', icon: FaTable, label: 'Transactions', color: '#DC2626' },
    { path: '/reports', icon: FaFileAlt, label: 'Reports', color: '#7C3AED' }
  ]

  return (
    <motion.aside 
      className="sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Logo Section */}
      <div className="sidebar-header">
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <FaWallet className="logo-icon" />
          <span className="logo-text">FINWISE</span>
        </motion.div>
        <div className="logo-subtitle">Personal Finance</div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <NavLink 
              to={item.path} 
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <motion.div
                className="nav-content"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon 
                  className="nav-icon" 
                  style={{ color: item.color }}
                />
                <span className="nav-label">{item.label}</span>
              </motion.div>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        <motion.button 
          className="logout-btn"
          onClick={handleLogout}
          whileHover={{ scale: 1.02, backgroundColor: '#EF4444' }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <FaSignOutAlt className="logout-icon" />
          <span>Logout</span>
        </motion.button>
      </div>
    </motion.aside>
  )
}
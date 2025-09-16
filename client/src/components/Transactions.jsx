import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaSearch, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaTags
} from 'react-icons/fa'
import { format } from 'date-fns'
import { fetchAllTransactions } from '../api'
import './Transactions.css'

const CATEGORIES = [
  "Housing", "Food", "Transportation", "Utilities", 
  "Insurance", "Healthcare", "Savings/Investment", 
  "Personal Spending", "Entertainment", "Miscellaneous"
]

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await fetchAllTransactions(1) // User ID 1 for demo
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || transaction.category === selectedCategory
      const matchesType = selectedType === 'All' || transaction.type === selectedType
      
      return matchesSearch && matchesCategory && matchesType
    })

    // Sort transactions
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'amount') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      } else if (sortField === 'date') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [transactions, searchTerm, selectedCategory, selectedType, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex)

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Housing': '#EF4444',
      'Food': '#F59E0B',
      'Transportation': '#3B82F6',
      'Utilities': '#8B5CF6',
      'Insurance': '#06B6D4',
      'Healthcare': '#EC4899',
      'Savings/Investment': '#10B981',
      'Personal Spending': '#F97316',
      'Entertainment': '#6366F1',
      'Miscellaneous': '#6B7280'
    }
    return colors[category] || '#6B7280'
  }

  if (loading) {
    return (
      <div className="transactions-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <FaMoneyBillWave />
        </motion.div>
        <p>Loading your transactions...</p>
      </div>
    )
  }

  return (
    <div className="transactions-container">
      {/* Header */}
      <motion.div 
        className="transactions-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="header-content">
          <h1>Transaction History</h1>
          <p>View and analyze all your financial transactions</p>
        </div>
        
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{filteredAndSortedTransactions.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">This Month</span>
            <span className="stat-value">
              {filteredAndSortedTransactions.filter(t => {
                const date = new Date(t.date)
                const now = new Date()
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
              }).length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="transactions-filters"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaTags className="filter-icon" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FaFilter className="filter-icon" />
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div 
        className="transactions-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="sortable">
                  <FaCalendarAlt className="th-icon" />
                  Date {getSortIcon('date')}
                </th>
                <th onClick={() => handleSort('description')} className="sortable">
                  Description {getSortIcon('description')}
                </th>
                <th onClick={() => handleSort('category')} className="sortable">
                  <FaTags className="th-icon" />
                  Category {getSortIcon('category')}
                </th>
                <th onClick={() => handleSort('amount')} className="sortable">
                  <FaMoneyBillWave className="th-icon" />
                  Amount {getSortIcon('amount')}
                </th>
                <th onClick={() => handleSort('type')} className="sortable">
                  Type {getSortIcon('type')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentTransactions.map((transaction, index) => (
                  <motion.tr 
                    key={transaction.id || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="transaction-row"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    <td className="date-cell">
                      <div className="date-content">
                        <span className="date-primary">
                          {format(new Date(transaction.date), 'MMM dd')}
                        </span>
                        <span className="date-secondary">
                          {format(new Date(transaction.date), 'yyyy')}
                        </span>
                      </div>
                    </td>
                    
                    <td className="description-cell">
                      <div className="description-content">
                        <span className="description-primary">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    
                    <td className="category-cell">
                      <span 
                        className="category-badge"
                        style={{ 
                          backgroundColor: `${getCategoryColor(transaction.category)}20`,
                          color: getCategoryColor(transaction.category),
                          borderColor: getCategoryColor(transaction.category)
                        }}
                      >
                        {transaction.category}
                      </span>
                    </td>
                    
                    <td className="amount-cell">
                      <div className={`amount-content ${transaction.type}`}>
                        <span className="amount-value">
                          ₹{parseFloat(transaction.amount).toLocaleString()}
                        </span>
                        <div className="amount-icon">
                          {transaction.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                        </div>
                      </div>
                    </td>
                    
                    <td className="type-cell">
                      <span className={`type-badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    
                    <td className="actions-cell">
                      <motion.button
                        className="view-btn"
                        onClick={() => setSelectedTransaction(transaction)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEye />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div 
          className="pagination"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </motion.div>
      )}

      {/* Transaction Detail Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTransaction(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Transaction Details</h3>
                <button 
                  className="modal-close"
                  onClick={() => setSelectedTransaction(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">
                    {format(new Date(selectedTransaction.date), 'MMMM dd, yyyy')}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedTransaction.description}</span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span 
                    className="detail-value category-badge"
                    style={{ 
                      backgroundColor: `${getCategoryColor(selectedTransaction.category)}20`,
                      color: getCategoryColor(selectedTransaction.category),
                      borderColor: getCategoryColor(selectedTransaction.category)
                    }}
                  >
                    {selectedTransaction.category}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className={`detail-value amount ${selectedTransaction.type}`}>
                    ₹{parseFloat(selectedTransaction.amount).toLocaleString()}
                  </span>
                </div>
                
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className={`detail-value type-badge ${selectedTransaction.type}`}>
                    {selectedTransaction.type}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
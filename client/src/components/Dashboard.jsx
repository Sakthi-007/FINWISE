import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'
import { 
  FaMoneyBillWave, 
  FaArrowUp, 
  FaArrowDown, 
  FaBalanceScale,
  FaFilter,
  FaCalendarAlt,
  FaChartLine
} from 'react-icons/fa'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { fetchAllTransactions, fetchTransactionsByMonth, processTransactionsForCharts } from '../api'
import './Dashboard.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const CATEGORIES = [
  "Housing", "Food", "Transportation", "Utilities", 
  "Insurance", "Healthcare", "Savings/Investment", 
  "Personal Spending", "Entertainment", "Miscellaneous"
]

// Helper function to format currency as Rupees
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [dashboardData, setDashboardData] = useState(null)

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    filterTransactions()
  }, [transactions, selectedCategory, selectedMonth, selectedYear])

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

  const filterTransactions = () => {
    let filtered = transactions

    // Filter by month and year
    if (selectedMonth !== 'All') {
      filtered = filtered.filter(transaction => {
        const date = new Date(transaction.date)
        return date.getMonth() + 1 === parseInt(selectedMonth) && 
               date.getFullYear() === parseInt(selectedYear)
      })
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(transaction => 
        transaction.category === selectedCategory
      )
    }

    setFilteredTransactions(filtered)
    const processedData = processTransactionsForCharts(filtered)
    setDashboardData(processedData)
  }

  // Chart configurations
  const pieChartData = {
    labels: Object.keys(dashboardData?.categoryData || {}),
    datasets: [
      {
        data: Object.values(dashboardData?.categoryData || {}).map(cat => Math.abs(cat.total)),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  const barChartData = {
    labels: Object.keys(dashboardData?.monthlyData || {}),
    datasets: [
      {
        label: 'Income',
        data: Object.values(dashboardData?.monthlyData || {}).map(month => month.income),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1
      },
      {
        label: 'Expense',
        data: Object.values(dashboardData?.monthlyData || {}).map(month => month.expense),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#9CA3AF'
        }
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="loading-spinner"
        >
          <FaChartLine />
        </motion.div>
        <p>Loading your financial dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1>Financial Dashboard</h1>
          <p>Track your financial journey with detailed insights</p>
        </div>
        
        {/* Filters */}
        <div className="dashboard-filters">
          <div className="filter-group">
            <FaFilter className="filter-icon" />
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
            <FaCalendarAlt className="filter-icon" />
            <select 
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Months</option>
              {Array.from({length: 12}, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {format(new Date(2024, i), 'MMMM')}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <select 
              value={selectedYear} 
              onChange={(e) => setSelectedYear(e.target.value)}
              className="filter-select"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <motion.div 
          className="summary-card income"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="card-icon">
            <FaArrowUp />
          </div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">₹{dashboardData?.totalIncome?.toLocaleString() || '0'}</p>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card expense"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="card-icon">
            <FaArrowDown />
          </div>
          <div className="card-content">
            <h3>Total Expense</h3>
            <p className="amount">₹{dashboardData?.totalExpense?.toLocaleString() || '0'}</p>
          </div>
        </motion.div>

        <motion.div 
          className="summary-card balance"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="card-icon">
            <FaBalanceScale />
          </div>
          <div className="card-content">
            <h3>Net Balance</h3>
            <p className={`amount ${dashboardData?.balance >= 0 ? 'positive' : 'negative'}`}>
              ₹{dashboardData?.balance?.toLocaleString() || '0'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="chart-header">
            <h3>Category Distribution</h3>
            <p>Expense breakdown by category</p>
          </div>
          <div className="chart-content">
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </motion.div>

        <motion.div 
          className="chart-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="chart-header">
            <h3>Monthly Trends</h3>
            <p>Income vs Expense over time</p>
          </div>
          <div className="chart-content">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div 
        className="recent-transactions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="table-header">
          <h3>Recent Transactions</h3>
          <p>Latest {filteredTransactions.length} transactions</p>
        </div>
        
        <div className="table-container">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.slice(0, 10).map((transaction, index) => (
                <motion.tr 
                  key={transaction.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + index * 0.05 }}
                >
                  <td>{format(new Date(transaction.date), 'MMM dd, yyyy')}</td>
                  <td className="description">{transaction.description}</td>
                  <td>
                    <span className="category-badge">{transaction.category}</span>
                  </td>
                  <td className={`amount ${transaction.type}`}>
                    ₹{parseFloat(transaction.amount).toLocaleString()}
                  </td>
                  <td>
                    <span className={`type-badge ${transaction.type}`}>
                      {transaction.type}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
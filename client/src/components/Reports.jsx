import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale,
} from 'chart.js'
import { Bar, Pie, Line, Doughnut, PolarArea } from 'react-chartjs-2'
import { 
  FaFileDownload, 
  FaFilter, 
  FaCalendarAlt, 
  FaChartBar,
  FaChartPie,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaBalanceScale,
  FaMoneyBillWave,
  FaPrint,
  FaShare
} from 'react-icons/fa'
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { fetchAllTransactions, processTransactionsForCharts } from '../api'
import './Reports.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  RadialLinearScale
)

const CATEGORIES = [
  "Housing", "Food", "Transportation", "Utilities", 
  "Insurance", "Healthcare", "Savings/Investment", 
  "Personal Spending", "Entertainment", "Miscellaneous"
]

const CHART_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
]

// Helper function to format currency as Rupees
const formatCurrency = (amount) => {
  return `₹${amount.toFixed(2)}`
}

// Helper function to get proper category name
const getCategoryDisplayName = (category) => {
  if (!category || category.trim() === '') {
    return 'Uncategorized'
  }
  
  // Map common variations to proper names
  const categoryMap = {
    'food': 'Food',
    'transport': 'Transportation',
    'transportation': 'Transportation',
    'housing': 'Housing',
    'utilities': 'Utilities',
    'insurance': 'Insurance',
    'healthcare': 'Healthcare',
    'savings/investment': 'Savings/Investment',
    'personal spending': 'Personal Spending',
    'entertainment': 'Entertainment',
    'miscellaneous': 'Miscellaneous'
  }
  
  const lowerCategory = category.toLowerCase().trim()
  return categoryMap[lowerCategory] || category
}

export default function Reports() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportType, setReportType] = useState('overview')
  const [dateRange, setDateRange] = useState('last6months')
  const [selectedCategories, setSelectedCategories] = useState(CATEGORIES)
  const [reportData, setReportData] = useState(null)
  const reportRef = useRef()

  useEffect(() => {
    loadTransactions()
  }, [])

  useEffect(() => {
    if (transactions.length > 0) {
      generateReportData()
    }
  }, [transactions, dateRange, selectedCategories])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await fetchAllTransactions()
      setTransactions(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error loading transactions:', error)
      setTransactions([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  const filterTransactionsByDate = (transactions) => {
    const now = new Date()
    let startDate = new Date()

    switch (dateRange) {
      case 'last1month':
        startDate = subMonths(now, 1)
        break
      case 'last3months':
        startDate = subMonths(now, 3)
        break
      case 'last6months':
        startDate = subMonths(now, 6)
        break
      case 'last1year':
        startDate = subMonths(now, 12)
        break
      default:
        return transactions
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= startDate && transactionDate <= now
    })
  }

  const generateReportData = () => {
    const dateFilteredTransactions = filterTransactionsByDate(transactions)
    
    const filteredTransactions = selectedCategories.length === CATEGORIES.length ? 
      dateFilteredTransactions : 
      dateFilteredTransactions.filter(transaction => selectedCategories.includes(transaction.category))

    const processedData = processTransactionsForCharts(filteredTransactions)
    
    // Generate additional insights
    const insights = generateInsights(filteredTransactions, processedData)
    
    setReportData({
      ...processedData,
      insights,
      filteredTransactions,
      totalTransactions: filteredTransactions.length
    })
  }

  const generateInsights = (transactions, processedData) => {
    const insights = []
    
    // Top spending category
    const topSpendingCategory = Object.entries(processedData.categoryData)
      .reduce((max, [category, data]) => 
        data.expense > (max?.data?.expense || 0) ? { category, data } : max, null)
    
    if (topSpendingCategory) {
      insights.push({
        type: 'spending',
        title: 'Top Spending Category',
        description: `${topSpendingCategory.category} accounts for ${formatCurrency(topSpendingCategory.data.expense)} of your expenses`,
        value: topSpendingCategory.data.expense,
        category: topSpendingCategory.category
      })
    }

    // Savings rate
    const savingsRate = processedData.totalIncome > 0 ? 
      ((processedData.totalIncome - processedData.totalExpense) / processedData.totalIncome) * 100 : 0
    
    insights.push({
      type: 'savings',
      title: 'Savings Rate',
      description: `You're saving ${savingsRate.toFixed(1)}% of your income`,
      value: savingsRate,
      trend: savingsRate >= 20 ? 'good' : savingsRate >= 10 ? 'average' : 'poor'
    })

    // Transaction frequency
    const avgTransactionsPerMonth = transactions.length / 
      (dateRange === 'last1month' ? 1 : dateRange === 'last3months' ? 3 : 
       dateRange === 'last6months' ? 6 : 12)
    
    insights.push({
      type: 'frequency',
      title: 'Transaction Frequency',
      description: `Average of ${Math.round(avgTransactionsPerMonth)} transactions per month`,
      value: avgTransactionsPerMonth
    })

    return insights
  }

  const getCategoryChartData = () => {
    if (!reportData?.categoryData) return null

    const categories = Object.keys(reportData.categoryData)
    const expenses = categories.map(cat => reportData.categoryData[cat].expense)

    return {
      labels: categories.map(cat => getCategoryDisplayName(cat)),
      datasets: [{
        label: 'Expenses by Category',
        data: expenses,
        backgroundColor: CHART_COLORS.slice(0, categories.length),
        borderColor: CHART_COLORS.slice(0, categories.length),
        borderWidth: 2,
      }]
    }
  }

  const getMonthlyTrendData = () => {
    if (!reportData?.monthlyData) return null

    const months = Object.keys(reportData.monthlyData).sort()
    const income = months.map(month => reportData.monthlyData[month].income)
    const expenses = months.map(month => reportData.monthlyData[month].expense)

    return {
      labels: months.map(month => format(new Date(month + '-01'), 'MMM yyyy')),
      datasets: [
        {
          label: 'Income',
          data: income,
          borderColor: '#4ECDC4',
          backgroundColor: 'rgba(78, 205, 196, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: expenses,
          borderColor: '#FF6B6B',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          tension: 0.4,
        }
      ]
    }
  }

  const getCategoryBreakdownData = () => {
    if (!reportData?.categoryData) return null

    const categories = Object.keys(reportData.categoryData)
    const totals = categories.map(cat => Math.abs(reportData.categoryData[cat].total))

    return {
      labels: categories.map(cat => getCategoryDisplayName(cat)),
      datasets: [{
        data: totals,
        backgroundColor: CHART_COLORS.slice(0, categories.length),
        borderWidth: 0,
      }]
    }
  }

  const exportToPDF = () => {
    window.print()
  }

  const exportToCSV = () => {
    if (!reportData?.filteredTransactions) return

    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Type'],
      ...reportData.filteredTransactions.map(transaction => [
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.amount,
        transaction.type
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finwise-report-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="reports-loading">
        <div className="loading-spinner"></div>
        <p>Generating reports...</p>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <motion.div 
        className="reports-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="reports-header">
          <div className="reports-title">
            <h1>Financial Reports</h1>
            <p>No transaction data available</p>
          </div>
        </div>
        <div className="no-data-message">
          <h3>No Transactions Found</h3>
          <p>Upload some bank statements first to generate reports.</p>
          <p>Go to the Upload page to get started.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="reports-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      ref={reportRef}
    >
      <div className="reports-header">
        <div className="reports-title">
          <h1>Financial Reports</h1>
          <p>Comprehensive analysis of your financial data</p>
        </div>
        
        <div className="reports-actions">
          <button className="export-btn" onClick={() => {
            console.log('Report Data:', reportData)
            console.log('Category Data Keys:', reportData?.categoryData ? Object.keys(reportData.categoryData) : 'No category data')
            console.log('Category Entries:', reportData?.categoryData ? Object.entries(reportData.categoryData) : 'No entries')
          }}>
            <FaShare /> Debug Data
          </button>
          <button className="export-btn" onClick={exportToPDF}>
            <FaPrint /> Print Report
          </button>
          <button className="export-btn" onClick={exportToCSV}>
            <FaFileDownload /> Export CSV
          </button>
        </div>
      </div>

      <div className="reports-filters">
        <div className="filter-group">
          <label>Date Range:</label>
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last1month">Last Month</option>
            <option value="last3months">Last 3 Months</option>
            <option value="last6months">Last 6 Months</option>
            <option value="last1year">Last Year</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Categories:</label>
          <div className="category-filters">
            {CATEGORIES.map(category => (
              <label key={category} className="category-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCategories([...selectedCategories, category])
                    } else {
                      setSelectedCategories(selectedCategories.filter(cat => cat !== category))
                    }
                  }}
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      </div>

      {reportData && (
        <div className="reports-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <motion.div 
              className="summary-card income"
              whileHover={{ scale: 1.02 }}
            >
              <FaArrowUp className="card-icon" />
              <div className="card-content">
                <h3>Total Income</h3>
                <p className="amount">{formatCurrency(reportData.totalIncome)}</p>
              </div>
            </motion.div>

            <motion.div 
              className="summary-card expense"
              whileHover={{ scale: 1.02 }}
            >
              <FaArrowDown className="card-icon" />
              <div className="card-content">
                <h3>Total Expenses</h3>
                <p className="amount">{formatCurrency(reportData.totalExpense)}</p>
              </div>
            </motion.div>

            <motion.div 
              className="summary-card balance"
              whileHover={{ scale: 1.02 }}
            >
              <FaBalanceScale className="card-icon" />
              <div className="card-content">
                <h3>Net Balance</h3>
                <p className={`amount ${reportData.balance >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(reportData.balance)}
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="summary-card transactions"
              whileHover={{ scale: 1.02 }}
            >
              <FaMoneyBillWave className="card-icon" />
              <div className="card-content">
                <h3>Transactions</h3>
                <p className="amount">{reportData.totalTransactions}</p>
              </div>
            </motion.div>
          </div>

          {/* Insights Section */}
          <div className="insights-section">
            <h2>Key Insights</h2>
            <div className="insights-grid">
              {reportData.insights.map((insight, index) => (
                <motion.div 
                  key={index}
                  className={`insight-card ${insight.type}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4>{insight.title}</h4>
                  <p>{insight.description}</p>
                  {insight.trend && (
                    <span className={`trend ${insight.trend}`}>
                      {insight.trend === 'good' ? 'Excellent' : 
                       insight.trend === 'average' ? 'Good' : 'Needs Improvement'}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-container">
              <h3>Monthly Income vs Expenses Trend</h3>
              {getMonthlyTrendData() && (
                <Line 
                  data={getMonthlyTrendData()}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `₹${value.toFixed(0)}`
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `${context.dataset.label}: ₹${context.parsed.y.toFixed(2)}`
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </div>

            <div className="chart-container">
              <h3>Expenses by Category</h3>
              {getCategoryChartData() && (
                <Bar 
                  data={getCategoryChartData()}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `₹${value.toFixed(0)}`
                        }
                      }
                    },
                    plugins: {
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            return `₹${context.parsed.y.toFixed(2)}`
                          }
                        }
                      }
                    }
                  }}
                />
              )}
            </div>

            <div className="chart-container">
              <h3>Category Distribution</h3>
              {getCategoryBreakdownData() ? (
                <Doughnut 
                  data={getCategoryBreakdownData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'right',
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => {
                            const label = context.label || ''
                            const value = context.parsed
                            const total = context.dataset.data.reduce((a, b) => a + b, 0)
                            const percentage = ((value / total) * 100).toFixed(1)
                            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`
                          }
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="no-data-message">
                  <p>No data available for chart visualization.</p>
                </div>
              )}
            </div>
          </div>

          {/* Detailed Breakdown Table */}
          <div className="breakdown-section">
            <h3>Category Breakdown</h3>
            <div className="breakdown-table">
              {reportData?.categoryData && Object.keys(reportData.categoryData).length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Income</th>
                      <th>Expenses</th>
                      <th>Net</th>
                      <th>% of Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.categoryData && Object.keys(reportData.categoryData).map((category) => {
                    const data = reportData.categoryData[category]
                    const percentage = reportData.totalExpense > 0 ? 
                      ((Math.abs(data.expense || 0) / reportData.totalExpense) * 100).toFixed(1) : '0.0'
                    
                    // Handle empty or invalid category names
                    const categoryName = getCategoryDisplayName(category)
                    
                    return (
                      <tr key={category || 'uncategorized'}>
                        <td className="category-name">{categoryName}</td>
                        <td className="amount positive">{formatCurrency(data.income || 0)}</td>
                        <td className="amount negative">{formatCurrency(data.expense || 0)}</td>
                        <td className={`amount ${(data.total || 0) >= 0 ? 'positive' : 'negative'}`}>
                          {formatCurrency(data.total || 0)}
                        </td>
                        <td>{percentage}%</td>
                      </tr>
                    )
                  })}
                </tbody>
                </table>
              ) : (
                <div className="no-data-message">
                  <p>No transaction data available for the selected criteria.</p>
                  <p>Try adjusting your date range or category filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
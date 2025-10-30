import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dashboard APIs
export const fetchAllTransactions = async (userId = 1) => {
  try {
    const response = await api.get(`/transactions/all/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching all transactions:', error)
    throw error
  }
}

export const fetchTransactionsByMonth = async (userId = 1, year, month) => {
  try {
    const response = await api.get(`/transactions/${userId}/${year}/${month}`)
    return response.data
  } catch (error) {
    console.error('Error fetching transactions by month:', error)
    throw error
  }
}

export const fetchTransactionsByCategory = async (userId = 1, category) => {
  try {
    const response = await api.get(`/transactions/category/${userId}`, {
      params: { category }
    })
    return response.data
  } catch (error) {
    console.error('Error fetching transactions by category:', error)
    throw error
  }
}

// Upload API
export const uploadBankStatement = async (file, onProgress) => {
  try {
    const formData = new FormData()
    formData.append('pdfFile', file)
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          onProgress(percentCompleted)
        }
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error uploading bank statement:', error)
    throw error
  }
}

// Data processing utilities
export const processTransactionsForCharts = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      categoryData: {},
      monthlyData: {},
      totalIncome: 0,
      totalExpense: 0,
      balance: 0
    }
  }

  const categoryData = {}
  const monthlyData = {}
  let totalIncome = 0
  let totalExpense = 0

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount)
    const category = transaction.category
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    // Category aggregation
    if (!categoryData[category]) {
      categoryData[category] = { income: 0, expense: 0, total: 0 }
    }

    if (transaction.type === 'income') {
      categoryData[category].income += amount
      totalIncome += amount
    } else {
      categoryData[category].expense += amount
      totalExpense += amount
    }
    categoryData[category].total += amount

    // Monthly aggregation
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0, total: 0 }
    }

    if (transaction.type === 'income') {
      monthlyData[monthKey].income += amount
    } else {
      monthlyData[monthKey].expense += amount
    }
    monthlyData[monthKey].total = monthlyData[monthKey].income - monthlyData[monthKey].expense
  })

  return {
    categoryData,
    monthlyData,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense
  }
}

// Reports API functions
export const generateReport = async (userId = 1, dateRange, categories) => {
  try {
    const transactions = await fetchAllTransactions(userId)
    return processTransactionsForReports(transactions, dateRange, categories)
  } catch (error) {
    console.error('Error generating report:', error)
    throw error
  }
}

export const processTransactionsForReports = (transactions, dateRange, categories) => {
  // Filter by date range
  const now = new Date()
  const filtered = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    let startDate = new Date()
    
    switch (dateRange) {
      case 'last1month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'last3months':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'last6months':
        startDate.setMonth(now.getMonth() - 6)
        break
      case 'last1year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate = new Date(0) // All time
    }
    
    return transactionDate >= startDate && 
           transactionDate <= now &&
           categories.includes(transaction.category)
  })
  
  return processTransactionsForCharts(filtered)
}

export const exportTransactionsToCSV = (transactions) => {
  const csvContent = [
    ['Date', 'Description', 'Category', 'Amount', 'Type'],
    ...transactions.map(transaction => [
      transaction.date,
      transaction.description,
      transaction.category,
      transaction.amount,
      transaction.type
    ])
  ].map(row => row.join(',')).join('\n')
  
  return csvContent
}

export default api
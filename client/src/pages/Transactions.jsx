import axios from 'axios';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import '../styles/transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters and sorting
  const [filters, setFilters] = useState({ type: 'all', category: 'all', month: 'all' });
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8000/api/getAllTransactions/1")
      .then(res => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching transactions:", err);
        setLoading(false);
      });
  }, []);

  // Memoize filtered and sorted transactions to avoid re-computation
  const filteredAndSortedTransactions = useMemo(() => {
    let processedTransactions = [...transactions];

    // Apply filters
    if (filters.type !== 'all') {
      processedTransactions = processedTransactions.filter(t => t.type === filters.type);
    }
    if (filters.category !== 'all') {
      processedTransactions = processedTransactions.filter(t => t.category === filters.category);
    }
    if (filters.month !== 'all') {
      processedTransactions = processedTransactions.filter(t => t.date.startsWith(filters.month));
    }

    // Apply sorting
    if (sortConfig.key !== null) {
      processedTransactions.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return processedTransactions;
  }, [transactions, filters, sortConfig]);

  // Get unique categories and months for filter dropdowns
  const uniqueCategories = useMemo(() => [...new Set(transactions.map(t => t.category))], [transactions]);
  const uniqueMonths = useMemo(() => [...new Set(transactions.map(t => t.date.substring(0, 7)))], [transactions]);


  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredAndSortedTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(filteredAndSortedTransactions.length / transactionsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleTransactionsPerPageChange = (e) => {
    setTransactionsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const transactionPagerouting = (transaction) => {
    const { id } = transaction;
    navigate(`${id}`, { state: transaction });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'ascending' ? '▲' : '▼';
  };

  return (
    <div className="transactions-container">
      <h2 className="page-title">Transaction History</h2>

      {/* Filter and Controls Section */}
      <div className="filters-bar card">
        <div className="filter-group">
          <label htmlFor="type-filter">Type:</label>
          <select id="type-filter" name="type" onChange={handleFilterChange} className="filter-select">
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select id="category-filter" name="category" onChange={handleFilterChange} className="filter-select">
            <option value="all">All</option>
            {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="month-filter">Month:</label>
          <select id="month-filter" name="month" onChange={handleFilterChange} className="filter-select">
            <option value="all">All</option>
            {uniqueMonths.map(month => <option key={month} value={month}>{month}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="entries-filter">Show:</label>
          <select id="entries-filter" name="entries" onChange={handleTransactionsPerPageChange} value={transactionsPerPage} className="filter-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span style={{marginLeft: '8px'}}>entries</span>
        </div>
      </div>

      {loading ? (<h1>Loading...</h1>) : (
        <>
          <div className="transaction-table-wrapper card">
            <table>
              <thead>
                <tr>
                  <th className="table-header sortable" onClick={() => handleSort('date')}>
                    Date {getSortIndicator('date')}
                  </th>
                  <th className="table-header" style={{maxWidth: '20px'}}>Description</th>
                  <th className="table-header">Category</th>
                  <th className="table-header sortable text-right" onClick={() => handleSort('amount')}>
                    Amount {getSortIndicator('amount')}
                  </th>
                  <th className="table-header">Type</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? currentTransactions.map((transaction, id) => {
                  const isIncome = transaction.type === 'income';
                  return (
                    <tr key={transaction.id || id} onClick={() => transactionPagerouting(transaction)} className="transaction-row">
                      <td className="table-cell font-bold">{transaction.date}</td>
                      <td className="table-cell description-cell">{transaction.description}</td>
                      <td className="table-cell">{transaction.category}</td>
                      <td className={`table-cell amount-cell ${isIncome ? 'income-color' : 'expense-color'}`}>
                        {isIncome ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                          {transaction.type}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <div className="pagination-info">
              Showing {filteredAndSortedTransactions.length > 0 ? indexOfFirstTransaction + 1 : 0} to {Math.min(indexOfLastTransaction, filteredAndSortedTransactions.length)} of {filteredAndSortedTransactions.length} entries
            </div>
            <div className="pagination-buttons">
              <PaginationButton onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                &larr; Previous
              </PaginationButton>
              <span className="page-number-display">Page {currentPage} of {totalPages > 0 ? totalPages : 1}</span>
              <PaginationButton onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                Next &rarr;
              </PaginationButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const PaginationButton = ({ children, onClick, disabled = false }) => (
  <button onClick={onClick} disabled={disabled} className="pagination-button">
    {children}
  </button>
);

export default Transactions;
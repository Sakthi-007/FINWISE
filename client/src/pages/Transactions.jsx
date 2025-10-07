import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/transactions.css';

const Transactions = () => {
  // console.log(res)
  const [transactions,setTransactions] = useState([]);

  useEffect(()=>{
    axios.get("http://localhost:8000/api/getAllTransactions/1")
    .then(res=>{
      setTransactions(res.data);
    })
  },[])
 
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const navigate = useNavigate();

  const transactionPagerouting = (transaction)=>{
    const {id}=transaction
    navigate(`${id}`,{state:transaction});
  }
  return (
    <div className="transactions-container">
      <h2 className="page-title">Transaction History</h2>
      {transactions.length==0 ?
      (<h1>Loading...</h1>)
      :
      (<>
        {/* Transaction Table */}
      <div className="transaction-table-wrapper card">
          <table>
            <thead>
              <tr>
                <th className={`table-header `}>
                  Date
                </th>
                <th className={`table-header `}>
                 Description
                </th>
                <th className={`table-header `}>
                 Category
                </th>
                <th className={`table-header text-right`}>
                  Amount
                </th>
                <th className={`table-header`}>
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction,id) => {
                const isIncome = transaction.type === 'income';
                return (
                  // Making the table row clickable to simulate navigation
                  <tr
                    key={id}
                    onClick={()=>transactionPagerouting(transaction)}
                    className="transaction-row"
                  >
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
              })}
            </tbody>
          </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <div className="pagination-info">
            Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} entries
        </div>
        <div className="pagination-buttons">
          <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
            &larr; Previous
          </PaginationButton>
          {[...Array(totalPages).keys()].map((number) => (
            <PaginationButton
              key={number + 1}
              onClick={() => paginate(number + 1)}
              isActive={currentPage === number + 1}
            >
              {number + 1}
            </PaginationButton>
          ))}
          <PaginationButton onClick={nextPage} disabled={currentPage === totalPages}>
            Next &rarr;
          </PaginationButton>
        </div>
      </div>
      </>)}
    </div>
  );
};


const PaginationButton = ({ children, onClick, disabled = false, isActive = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`pagination-button ${isActive ? 'active' : ''}`}
  >
    {children}
  </button>
);

export default Transactions
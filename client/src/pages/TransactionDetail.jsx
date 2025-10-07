import { useLocation, useNavigate } from "react-router";

const TransactionDetail = ({onBack}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const transaction = location.state;
  if (!transaction) {
    return (
      <div className="content-padding text-center text-red">
        Transaction not found.
        <button onClick={onBack} className="back-button-link">Go Back</button>
      </div>
    );
  }

  const isIncome = transaction.type === 'income';

  return (
    <div className="transactions-container">
      <div className="detail-header">
        <h2 className="detail-title">Transaction Details</h2>
        <button
          onClick={()=>navigate("/transactions")}
          className="back-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="back-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to List</span>
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-grid">
          <DetailItem label="Transaction ID" value={transaction.id} />
          <DetailItem label="Date" value={transaction.date} />
          <DetailItem label="Category" value={transaction.category} />
          
          <DetailItem label="Type" value={
            <span className={`badge uppercase ${isIncome ? 'badge-income' : 'badge-expense'}`}>
              {transaction.type}
            </span>
          } />
          <DetailItem label="Amount" value={
            <span className={`amount-display ${isIncome ? 'income-color' : 'expense-color'}`}>
              {isIncome ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
            </span>
          } />
        </div>
        
        <div className="detail-description-section">
          <DetailItem label="Description" value={transaction.description} className="full-width" />
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, className = "" }) => (
  <div className={`detail-item ${className}`}>
    <span className="detail-item-label">{label}</span>
    <div className="detail-item-value">{value}</div>
  </div>
);

export default TransactionDetail;
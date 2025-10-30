# FINWISE - Financial Management System Project Report

## Project Overview

**FINWISE** is a comprehensive personal finance management application that enables users to track, categorize, and analyze their financial transactions through automated bank statement processing and intelligent reporting.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 19.1.1 with Vite 7.1.2
- **Routing**: React Router DOM 7.9.1
- **UI/UX**: Framer Motion 12.23.13 for animations
- **Visualization**: Chart.js 4.5.0 with React-ChartJS-2 5.3.0
- **Styling**: Custom CSS with responsive design
- **File Processing**: React Dropzone 14.3.8 for PDF uploads

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express 5.1.0
- **Database**: PostgreSQL with pg 8.16.3
- **AI Processing**: Google Gemini AI 0.24.1 for transaction extraction
- **File Processing**: PDF-Parse 1.1.1 and Multer 2.0.2
- **Security**: CORS 2.8.5 for cross-origin requests

## Key Features

### 1. **Automated Transaction Processing**
- PDF bank statement upload via drag-and-drop interface
- AI-powered transaction extraction using Google Gemini
- Automatic categorization into 10 predefined categories:
  - Housing, Food, Transportation, Utilities
  - Insurance, Healthcare, Savings/Investment
  - Personal Spending, Entertainment, Miscellaneous

### 2. **Interactive Dashboard**
- Real-time financial overview with key metrics
- Visual charts for expense distribution and trends
- Filtering by categories, months, and date ranges
- Responsive design for all device sizes

### 3. **Transaction Management**
- Complete transaction history with search and filter capabilities
- Category-based organization and analysis
- Monthly and yearly transaction summaries
- Bulk transaction processing and validation

### 4. **Advanced Reporting System** ⭐ **NEW FEATURE**

#### Report Types:
- **Overview Reports**: Complete financial summary with key insights
- **Category Analysis**: Detailed breakdown by spending categories
- **Trend Analysis**: Monthly income vs expense patterns
- **Custom Date Ranges**: Last month, 3 months, 6 months, or 1 year

#### Visualizations:
- **Line Charts**: Monthly income vs expenses trends
- **Bar Charts**: Category-wise expense distribution
- **Doughnut Charts**: Proportional spending breakdown
- **Polar Area Charts**: Multi-dimensional category analysis

#### Key Insights Generated:
- **Top Spending Categories**: Identifies highest expense areas
- **Savings Rate**: Calculates percentage of income saved
- **Transaction Frequency**: Average monthly transaction volume
- **Spending Patterns**: Identifies trends and anomalies

#### Export Capabilities:
- **PDF Export**: Print-ready formatted reports
- **CSV Export**: Raw transaction data for external analysis
- **Interactive Sharing**: Social media and email integration

### 5. **Smart Analytics**
- Automated financial health assessment
- Spending pattern recognition
- Budget variance analysis
- Predictive insights for future spending

## Technical Implementation

### Database Schema
```sql
transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  date DATE,
  amount DECIMAL(10,2),
  category VARCHAR(50),
  description TEXT,
  type VARCHAR(20)
)
```

### AI Integration
- **Google Gemini 2.5 Flash**: Processes PDF statements
- **Structured Output**: JSON-formatted transaction data
- **Category Classification**: 10-category intelligent sorting
- **Error Handling**: Validation and fallback mechanisms

### Security Features
- Input validation and sanitization
- File type restrictions (PDF only)
- Size limits (10MB maximum)
- CORS protection for API endpoints

## File Structure

```
FINWISE/
├── backend/
│   ├── index.js                 # Main server file
│   ├── database/
│   │   ├── dbconnection.js      # PostgreSQL connection
│   │   ├── queries.js           # SQL query definitions
│   │   ├── transactions.js      # Transaction operations
│   │   └── user.js              # User management
│   ├── gemini/
│   │   └── ai.mjs              # AI processing logic
│   ├── routes/
│   │   └── routes.js           # API route definitions
│   └── utils/
│       └── pdfParser.js        # PDF processing utilities
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Upload.jsx       # File upload interface
│   │   │   ├── Transactions.jsx # Transaction management
│   │   │   ├── Reports.jsx      # ⭐ Advanced reporting
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   └── LoadingScreen.jsx# Loading animations
│   │   ├── App.jsx              # Main application component
│   │   ├── api.js               # API integration layer
│   │   └── main.jsx             # Application entry point
│   └── public/                  # Static assets
```

## Performance Optimizations

### Frontend:
- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo for expensive components
- **Virtual Scrolling**: Large transaction lists
- **Image Optimization**: Compressed assets and icons

### Backend:
- **Connection Pooling**: PostgreSQL connection management
- **Async Processing**: Non-blocking file operations
- **Caching**: Frequently accessed data optimization
- **Batch Operations**: Multiple transaction inserts

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload and process bank statement |
| GET | `/api/transactions/all/:userId` | Fetch all user transactions |
| GET | `/api/transactions/:userId/:year/:month` | Monthly transactions |
| GET | `/api/transactions/category/:userId` | Category-filtered transactions |
| POST | `/api/reports/generate/:userId` | Generate custom reports |

## Future Enhancements

### Phase 2 Features:
- **Budget Management**: Set and track spending limits
- **Goal Setting**: Financial target tracking
- **Multi-Bank Support**: Multiple account integration
- **Mobile App**: React Native implementation

### Phase 3 Features:
- **Investment Tracking**: Portfolio management
- **Bill Reminders**: Automated payment notifications
- **Financial Advisor**: AI-powered recommendations
- **Multi-Currency**: International transaction support

## Development Workflow

### Setup Instructions:
1. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Database Setup**:
   - Install PostgreSQL
   - Configure environment variables
   - Run database migrations

### Dependencies Status:
- ✅ All frontend dependencies installed and updated
- ✅ Backend dependencies configured
- ✅ Database connection established
- ✅ AI integration functional
- ✅ Reports feature implemented

## Testing Strategy

### Unit Tests:
- Component rendering and interaction
- API endpoint functionality
- Database query validation
- AI processing accuracy

### Integration Tests:
- End-to-end transaction processing
- File upload and parsing workflow
- Report generation and export
- Cross-browser compatibility

## Deployment Considerations

### Production Environment:
- **Frontend**: Vercel/Netlify deployment
- **Backend**: Heroku/Railway hosting
- **Database**: PostgreSQL on Railway/Supabase
- **File Storage**: AWS S3/Cloudinary integration

### Security Measures:
- Environment variable management
- API rate limiting implementation
- Input validation and sanitization
- HTTPS enforcement in production

## Conclusion

FINWISE successfully combines modern web technologies with AI-powered automation to create an intuitive and powerful personal finance management solution. The newly implemented **Advanced Reporting System** provides users with comprehensive insights into their financial behavior through interactive visualizations and intelligent analytics.

The application demonstrates best practices in full-stack development, including:
- Clean architecture and separation of concerns
- Responsive and accessible user interface design
- Robust error handling and data validation
- Scalable database design and API structure
- AI integration for enhanced user experience

---

**Project Status**: ✅ **Development Complete with Reports Feature**  
**Last Updated**: October 30, 2025  
**Version**: 1.1.0 (Reports Enhancement)  
**Developer**: Sakthi-007  
**Repository**: [FINWISE](https://github.com/Sakthi-007/FINWISE)
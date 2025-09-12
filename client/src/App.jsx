import { useState } from 'react'
import './App.css'
import BankStatementUpload from './upload.jsx'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BankStatementUpload />
    </>
  )
}

export default App

import React from 'react'
import Login  from './pages/Login'
import Signup from './pages/Signup'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from './pages/home';
import BankStatementUpload from './upload.jsx'
const router = createBrowserRouter([
  {
    path:'/',
    Component:Home
  },
])

function App() {

  return (
    <>   
    <BankStatementUpload />  
    <RouterProvider router={router}/> 
    <>);
}
export default App

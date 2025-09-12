import React from 'react'
import Login  from './pages/Login'
import Signup from './pages/Signup'
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { Home } from './pages/home';

const router = createBrowserRouter([
  {
    path:'/',
    Component:Home
  },
])

function App() {

  return (
    <>   
      <RouterProvider router={router}/>
    </>
  )
}

export default App

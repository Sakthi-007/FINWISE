import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import './App.css'
import router from './routerconfig.js'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
    {/* <App prop={"hi"}>
      <div>hello</div>
    </App> */}
  </StrictMode>
)

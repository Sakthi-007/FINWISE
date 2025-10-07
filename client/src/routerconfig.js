import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Upload from "./pages/Upload";

const checkLoggedIn=async()=>{
    const token =  true //localStorage.getItem("token") //|| true;

    if(!token) return redirect("login");
    return token;
    // return redirect("login")
}

const router = createBrowserRouter([
  {
    path:'/',
    Component:Home,
    loader : async()=>{
      return checkLoggedIn();
    },
    children:[
      {
        index:true,
        Component:Dashboard,
      },{
        path:"transactions",
        Component:Transactions
      },{
        path:"upload",
        Component:Upload
      }
    ]
  }
  ,{
    path:'/login',
    Component:Login
  },{
    path:'/signup',
    Component:Signup
  },{
    path:"/*",
    Component:NotFound
  }
])

export default router
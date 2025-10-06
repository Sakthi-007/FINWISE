import { createBrowserRouter, redirect } from "react-router";
import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const checkLoggedIn=async()=>{
    const token = localStorage.getItem("token") || true;

    if(!token) return redirect("login");
    return token;
}

const router = createBrowserRouter([
  {
    path:'/',
    Component:Home,
    loader : async()=>{
      return checkLoggedIn();
    }
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
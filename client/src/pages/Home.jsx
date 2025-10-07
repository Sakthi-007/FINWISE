import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const Home = () => {

  return (
    <>
      <div className="home">
        <Navbar/>
        <Outlet/>
      </div>
    </>
  )
}

export default Home;

import './App.css';
import { Routes, Route } from "react-router-dom";
import Setting from './pages/Setting';
import MainPage from './pages/MainPage';

import Sidebar from './Sidebar';
import Navbar from './navbar';

function RouteManager() {
  return (
    <div className='flex flex-col w-full h-screen bg-zinc-800 outline-blue-700'>
    <div>
       {/* { < Navbar /> }  */}
    </div>
      <Routes>
      {/* { <Sidebar /> } */}
        <Route path="/" element={<MainPage />} />
        <Route path="/setting" element={<Setting />} />

      </Routes>
    </div>
  );
}

export default RouteManager;

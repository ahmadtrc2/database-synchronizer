import { Store } from 'react-notifications-component'
import React, { useEffect, useState, useRef } from 'react'
import logo from './logo512.png'
// import './MainPage.css';


const electron = window.require('electron');

const MainPage = () => {
  const [config, setConfig] = useState({
    Username: "ahmsd",
    Password: '1234',
     
 
  });



const scrollRef = useRef(null);

  const [bellState, setBellState] = useState('normal');


  const [info, setInfo] = useState();



  const handleLogin = () => {
    electron.ipcRenderer.send('set:upload', );
    setInfo('بلساسیاس=------------------------------------------------------این متن نمونه‌ای برای نمایش است. این متن برای آزمایش طراحی باکس با اسکربول ابببببببب=========================================================ستفاده می‌شود. امیدواریم به شما کمک ===============================کند.==================== هر چند این متن ادامه دارد تا بیشتر از ۴ خط شود و ما اسکرول را مشاهده کنیم. بیایید ببینیم که آیا این متن به درستی در باکس قرار می‌گیرد یا خیر.');

    Store.addNotification({
        message: "عملیات آپلود با موفقیت آغاز شد",
        type: "success",
        insert: "center",
        container: "center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 1000,
            onScreen: true
        }
    });
};

const handleSetConfig = (e) => {
  if (e.target.value === 1) {
      setConfig((prev) => ({ ...prev, [e.target.name]: 1 }));
  } else {
      setConfig((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
}



  return (
    <div className="flex flex-col justify-between h-screen p-4 bg-zinc-800">
      
      <div className="flex-col flex items-center justify-center">


      <div className='flex flex-row items-center justify-end w-full h-16 p-4 text-gray-300'>
                  <h1 className='flex items-center justify-start w-full h-16 text-gray-300'>Username:</h1>
            </div>
            <div className='flex flex-row items-center justify-center w-full h-16 p-4 text-gray-300 shadow  bg-zinc-600'>
                <input onChange={handleSetConfig} value={config.Username} name={'Username'} className='flex items-center justify-end w-6/12 h-12 text-center text-gray-300 border border-zinc-900 bg-zinc-900' />
            </div>

            <div className='flex flex-row items-center justify-end w-full h-16 p-4 text-gray-300'>
                  <h1 className='flex items-center justify-start w-full h-16 text-gray-300'>Password:</h1>
            </div>
            <div className='flex flex-row items-center justify-center w-full h-16 p-4 text-gray-300 shadow  bg-zinc-600'>
                <input onChange={handleSetConfig} value={config.Password} name={'Password'} className='flex items-center justify-end w-6/12 h-12 text-center text-gray-300 border border-zinc-900 bg-zinc-900' />
            </div>

            <div className='flex flex-row items-center justify-center w-full h-16 p- text-gray-300 shadow bg-zinc-700' dir='rtl'>
                <button onClick={handleLogin} className='flex items-center justify-center w-2/12 h-12 ml-5 text-center text-gray-300 bg-green-900 border border-zinc-800' >Login</button>
            </div>


      </div>

            <div ref={scrollRef} className="p-2 border border-gray-300 bg-neutral-300 rounded-md text-center overflow-auto max-h-50">
                  {info}       
            </div>

    </div>
  );
};


export default MainPage
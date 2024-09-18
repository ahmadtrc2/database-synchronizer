import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
const electron = window.require('electron');

const Navbar = () => {
    useEffect(() => {
        // electron.ipcRenderer.send('run');
    }, []);

    return (
            <div  className='flex flex-row w-auto h-10 border-1-2 divide-y-2    '   ></div>
    );
    // return (
    //     <div className='flex flex-col w-2/12 h-auto min-h-screen border-l-2 divide-y-2 border-zinc-900 divide-zinc-900 bg-zinc-800'>
    //         <Link to="/" className='flex items-center justify-center w-full h-16 text-white text-md bg-zinc-700 '>صفحه اصلی</Link>
    //         {/* <Link to="باید ست شود" className='flex items-center justify-center w-full h-16 text-white text-md bg-zinc-700'>حساب کاربری</Link> */}
    //         <Link to="setting" className='flex items-center justify-center w-full h-16 text-white text-md bg-zinc-700 '>تنظیمات</Link>
    //     </div>
    // )
}

export default Navbar









// async function connectToSourceDatabase(userName, password) {
//     console.log("----------------this are proiperty from  electron class",userName,password)
//     const userNames="mola"
//     const passwords="1234"
//     try {
//       await sql.connect(`Server=.,1434; Initial Catalog=IFA; User Id =${userNames}; password =${passwords}; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
//       // await sql.connect(`Server=.,1434; Initial Catalog=IFA; User Id =${userName}; password =${password}; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
//       console.log("-------------------------------------------------------Connected to source Database-----------------------------------------------------");
//     } catch (err) {
//       console.error("-------------------------------------------------------source Database connection failed:-------------------------------------------------- ", err);
//     }
//   }

//   async function connectToLocalDatabase() {
//     try {
//       await sql.connect("Server=DESKTOP-3MN9M54\MSSQLSERVER01,50439; Initial Catalog=IFA; User Id=ahmad; password=1234; Integrated Security=false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;");
//       console.log("-------------------------------------------------------Connected to Local Database-----------------------------------------------------");
//     } catch (err) {
//       console.error("-------------------------------------------------------Local Database connection failed:-------------------------------------------------- ", err);
//     }
//   }d
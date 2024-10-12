const sql = require('mssql');
const express = require("express");
const app = express();
const pools = new Map();



// const config = {
//   user: 'ahmad',
//   password: '1234',
//   server: '.',
//   database: 'master',
//   port: 1434,
//   options: {
//     encrypt: false,
//     trustServerCertificate: true,
//     enableArithAbort: true
//   }
// };

const LocalConfigDb="Server=rabihavi-2036,1434; Initial Catalog=ifaTest; User Id=test; password=zas14789;TrustServerCertificate=true; MultipleActiveResultSets=true;"

const SourceConfigDb=`Server=172.100.9.118\\CENTRALDMZ19,4205; Initial Catalog=IFA; User Id =ifa-sql; password =IFA123456; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`
// const pool = new mssql.ConnectionPool(config);

pools.set("localDbPool",LocalConfigDb)
pools.set("sourceDbPool",SourceConfigDb)


async function connectToSourceDatabase(userName, password) {
  // console.log("----------------this are proiperty from  electron class-----------",userName,password)

  try {
    await sql.close()
    const Spool = await sql.connect(`Server=172.100.9.118\\CENTRALDMZ19,4205; Initial Catalog=IFA; User Id =ifa-sql; password =IFA123456; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
    console.log("-------------------------------------------------------Connected to source Database-----------------------------------------------------");
    // console.log("++++++++++++++++++++++++++++++++++Spool++++++++++++++++++++++++++++++++++++++ ",Spool);

    return Spool
    
  } catch (err) {
    console.error("-------------------------------------------------------source Database connection failed:-------------------------------------------------- ", err);
  }

}

// IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'allDate')
async function connectToLocalDatabase() {
  try {
    await sql.close()

    const Lpool = await sql.connect("Server=rabihavi-2036,1434; Initial Catalog=ifaTest; User Id=test; password=zas14789;TrustServerCertificate=true; MultipleActiveResultSets=true;  connectionTimeout: 30000");
    console.log("-------------------------------------------------------Connected to Local Database-----------------------------------------------------");
    // console.log("++++++++++++++++++++++++++++++++++Lpool++++++++++++++++++++++++++++++++++++++ ",Lpool);

    if (!Lpool) {
      console.error("Connection failed: pool is undefined");
      return;
    }
    
  //   console.log("-------------------------------------------------------Local Database creating table-----------------------------------------------------");
  //   await Lpool.request().query(`
  //     IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'allDatasForTest')
  //     CREATE TABLE allDatasForTest (
  //         id INT PRIMARY KEY,
  //         SerialNumber NVARCHAR(50),
  //         customerName NVARCHAR(100),
  //         RegionName NVARCHAR(100),
  //         reciveData DATETIME,
  //         AverageDaylyFlow FLOAT,
  //         PositiveVolume FLOAT,
  //         NegativeVolume FLOAT,
  //         NetVolume FLOAT
  //     )
  // `);
  return Lpool
  } catch (err) {
    console.error("-------------------------------------------------------Local Database connection failed:-------------------------------------------------- ", err);
  }

  try{


  }catch(err){
    console.log("-----------------------------we have some problem with creating table-----------------------------------",err)
  }
  
}
module.exports = {connectToSourceDatabase,connectToLocalDatabase};

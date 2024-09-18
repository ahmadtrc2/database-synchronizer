const sql = require('mssql');
const express = require("express");
const app = express();



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


async function connectToSourceDatabase(userName, password) {
  console.log("----------------this are proiperty from  electron class",userName,password)
  const userNames="ifa-sql"
  const passwords="IFA123456"
  try {
    await sql.connect(`Server=172.100.9.118\\CENTRALDMZ19,4205; Initial Catalog=IFA; User Id =ifa-sql; password =IFA123456; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
    console.log("-------------------------------------------------------Connected to source Database-----------------------------------------------------");
    // console.log("++++++++++++++++++++++++++++executeQuery im db config++++++++++++++++++++++++++++++++++++++ ",await sql.query("SELECT TOP 50 * FROM AllDatas"));
    assa
  } catch (err) {
    console.error("-------------------------------------------------------source Database connection failed:-------------------------------------------------- ", err);
  }
}

async function connectToLocalDatabase() {
  try {
    await sql.connect("Server=DESKTOP-3MN9M54\\MSSQLSERVER01,50439; Initial Catalog=IFA; User Id=ahgdmad; password=1234; Integrated Security=false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;");
    console.log("-------------------------------------------------------Connected to Local Database-----------------------------------------------------");
  } catch (err) {
    console.error("-------------------------------------------------------Local Database connection failed:-------------------------------------------------- ", err);
  }
}
module.exports = {connectToSourceDatabase,connectToLocalDatabase};



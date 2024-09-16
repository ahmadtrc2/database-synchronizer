const sql = require('mssql');
const express = require("express");
const app = express();



const config = {
  user: 'mola',
  password: '1234',
  server: '.',
  database: 'master',
  port: 1434,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};


async function connectToSourceDatabase(userName, password) {
  console.log("----------------this are proiperty from  electron class",userName,password)
  const userNames="mola"
  const passwords="1234"
  try {
    await sql.connect(`Server=.,1434; Initial Catalog=IFA; User Id =${userNames}; password =${passwords}; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
    // await sql.connect(`Server=.,1434; Initial Catalog=IFA; User Id =${userName}; password =${password}; Integrated Security = false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;`);
    console.log("-------------------------------------------------------Connected to source Database-----------------------------------------------------");
  } catch (err) {
    console.error("-------------------------------------------------------source Database connection failed:-------------------------------------------------- ", err);
  }
}

async function connectToLocalDatabase() {
  try {
    await sql.connect("Server=DESKTOP-3MN9M54\MSSQLSERVER01,50439; Initial Catalog=IFA; User Id=ahmad; password=1234; Integrated Security=false; TrustServerCertificate=true; MultipleActiveResultSets=true; Trusted_Connection=true;");
    console.log("-------------------------------------------------------Connected to Local Database-----------------------------------------------------");
  } catch (err) {
    console.error("-------------------------------------------------------Local Database connection failed:-------------------------------------------------- ", err);
  }
}
module.exports = {connectToSourceDatabase,connectToLocalDatabase};



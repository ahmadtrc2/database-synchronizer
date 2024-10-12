const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const electron = require("electron");
const Store = require("electron-store");
const axios = require("axios");
const FormData = require("form-data");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const {  connectToLocalDatabase,  connectToSourceDatabase,} = require("./dbConfig");
const sql = require("mssql");

const ipc = electron.ipcMain;

var sqlConfig;
var sourceDbPool;
var localDbPool;



function createWindow() {
  const win = new BrowserWindow({
    icon: path.join(__dirname, "logo192.png"),
    width: 600,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      nodeIntegrationInSubFrames: true,
      webSecurity: false,
      backgroundThrottling: false,
    },
  });

  if (process.env.APP_STAGE === "dev") {
    win.loadURL("http://localhost:3000");
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    );
  }

  const store = new Store();
  const dir = path.join(app.getPath("userData"), "store", "");
  console.log("stage", process.env.APP_STAGE);
}

async function executeQuery() {
  
  try {
    let sourceDbPool =  await connectToSourceDatabase(config.Username, config.Password)
    const result = await sourceDbPool.request().query("SELECT TOP 1 * FROM AllDatas");
    console.log("++++++++++++++++++++++++++++executeQuery++++++++++++++++++++++++++++++++++++++sourceDbPool ",result);
    
    return result.recordset;
  } catch (err) {
    console.error("Error executing query:", err);
  }
}


app.on("ready", async () => {
  createWindow();
  connectToLocalDatabase()
  // // localDbPool = await connectToLocalDatabase();
  // // sourceDbPool = await connectToSourceDatabase(config.Username, config.Password);
  // try {
  //   // await connectToLocalDatabase();
  //   // const result = await executeQuery();
  //   // console.log("Query Result:", result);
  // } catch (error) {
  //   console.error("Error in executing query:", error);
  // }
});

//GET data base config
ipc.on("get:config", async (event, config) => {
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-**-*-*-*-*-*-get:config*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-")
  const store = new Store();

  try {
    let sourceDbPool = await connectToSourceDatabase(config.Username, config.Password)
    const result = await sourceDbPool.request().query("SELECT TOP 1 * FROM AllDatas");
    console.log("Connected to Source Database, Result:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  }

  connectToLocalDatabase()


});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipc.on("exit", async (event, payload) => {});

async function runCommand(command) {
  const { stdout, stderr, error } = await exec(command);
  if (stderr) {
    console.error("stderr:", stderr);
  }
  if (error) {
    console.error("error:", error);
  }
  return stdout;
}

let stopFlag = false;
let inter;

ipc.on("set:config", async (event,config) => {
  // try {
  //   const result = await executeQuery();
  //   console.log("Query Result:", result);
  // } catch (error) {
  //   console.error("Error in executing query:", error);
  // }
  // await connectToSourceDatabase(config.Username,config.Password );

    inter = setInterval(async () => {
      if (!stopFlag) {
         checkForNewDataAndSend();
      }
    }, 10000);
});

ipc.on("set:stop", async (event) => {
  stopFlag = true;
  if (stopFlag) {
    clearInterval(inter);
  }
});

ipc.on("open:store", async () => {
  const _path = path.join(app.getPath("userData"), "store");
  electron.shell.openPath(_path);
});

process.on("uncaughtException", function (err) {
  console.log("Caught exception: " + err);
});
let lastCheckedId = 0;

async function checkForNewDataAndSend(targetUrl) {
  console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-we are in checkForNewDataAndSend  sqlConfig-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-",)
  try {

    let sourceDbPool = await connectToSourceDatabase("ifa-sql", "IFA123456")

    const result = await sourceDbPool.request()
    .input("lastId", sql.Int, lastCheckedId)
    .query(`
      SELECT TOP 3 * FROM AllDatas
      WHERE Id > @lastId
      ORDER BY Id ASC
      `);
      
      const newRecords = result.recordset;
    console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-we are in checkForNewDataAndSend -*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-",newRecords)

      // app.send("set,TextBox",newRecords)

    if (newRecords.length > 0) {
      await initializeDatabase()
     await insertData(result)

    } else {
      console.log("No new records found.");
    }
  } catch (error) {
    console.error("Error in fetching data from database", error.message);
  }
}
/////////////////////////////////////////////////////////////





async function initializeDatabase() {
    try {
      console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-initializeDatabase-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-")

        let localDbPool = await connectToLocalDatabase()
        await localDbPool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'allDatasForTest')
            CREATE TABLE allDatasForTest (
                id INT PRIMARY KEY,
                SerialNumber NVARCHAR(50),
                CustomerName NVARCHAR(100),
                RegionName NVARCHAR(100),
                ReceiveDate NVARCHAR(50),
                AverageDailyFlow FLOAT,
                PositiveVolume FLOAT,
                NegativeVolume FLOAT,
                NetVolume FLOAT
                )
                `);
                console.log("Database initialized");
              } catch (err) {
                console.error("Error initializing database: ", err);
              }
            }
            


async function insertData(data) {
  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-insertData-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-data:",data)
  const localDbPool = await connectToLocalDatabase();

  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-hard check insertData 1-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-data:",data.recordset[1])
  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-hard check insertData 2-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-data:",data.recordset[2])
  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-hard check insertData 3-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-data:",data.recordset[3])

  const dataArray = data.recordset;
  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-hard check insertData -*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-Alldata:",dataArray)
  // console.log("-*-*-**--*-*-*-*-*-*-*-*-*-*-*-hard check insertData 2-*-*-*-*-*-**-**-*-*--*-*-*-*-*-*-*-*-*-*-*--*-**-data:",dataArray[2])
 
  if (!Array.isArray(dataArray) || dataArray.length === 0) {
      console.error("No valid data array provided");
      return;
  }    

  try {

      let dataLength = dataArray.length
      // console.log("+++++++++++++++++++++++++++++++dataLength:++++++++++++++++++++++++++++++++", dataLength);

      for (let i=0; i<dataLength; i++) {
        // console.log("+++++++++++++++++++++++++++++++  i   :++++++++++++++++++++++++++++++++", i);

          // console.log("+++++++++++++++++++++++++++++++Inserting data:++++++++++++++++++++++++++++++++", dataArray[i]);
          console.log("+++++++++++++++++++++++++++++++dataArray[i].ReceiveDate: ++++++++++++++++++++++++++++++++brfore",typeof(dataArray[i].ReceiveDate));
          
          dataArray[i].ReceiveDate = dataArray[i].ReceiveDate.toString()
          console.log("+++++++++++++++++++++++++++++++dataArray[i].ReceiveDate: ++++++++++++++++++++++++++++++++after",typeof(dataArray[i].ReceiveDate));

          const {
              id, SerialNumber, CustomerName, RegionName, ReceiveDate,
              AverageDailyFlow, PositiveVolume, NegativeVolume, NetVolume
          } = dataArray[i];
          console.log("+++++++++++++++++++++++++++++++Inserting data in for :++++++++++++++++++++++++++++++++",id, SerialNumber, CustomerName, RegionName, ReceiveDate,
            AverageDailyFlow, PositiveVolume, NegativeVolume, NetVolume );



          const query = `
              INSERT INTO allDatasForTest 
              (id, SerialNumber, CustomerName, RegionName, ReceiveDate, 
              AverageDailyFlow, PositiveVolume, NegativeVolume, NetVolume)
              VALUES 
              (@id, @SerialNumber,
              @CustomerName, @RegionName, @ReceiveDate, 
              @AverageDailyFlow, @PositiveVolume, @NegativeVolume, @NetVolume)
          `;
          // console.log("+++++++++++++++++++++++++++++++Inserting query:++++++++++++++++++++++++++++++++", query);

          await localDbPool.request()
          .input('id', sql.Int, id)
          .input('SerialNumber', sql.NVarChar, SerialNumber)
          .input('CustomerName', sql.NVarChar, CustomerName)
          .input('RegionName', sql.NVarChar, RegionName)
          .input('ReceiveDate', sql.DateTime, new Date(ReceiveDate)) 
          .input('AverageDailyFlow', sql.Float, parseFloat(AverageDailyFlow)) 
          .input('PositiveVolume', sql.Float, parseFloat(PositiveVolume))
          .input('NegativeVolume', sql.Float, parseFloat(NegativeVolume))
          .input('NetVolume', sql.Float, parseFloat(NetVolume))
          .query(query);

          console.log(`Data for id ${id} inserted successfully`);
      }
  } catch (err) {
      console.error("Error inserting data: ", err);
  }
}


// // فراخوانی تابع برای راه‌اندازی دیتابیس
// initializeDatabase();
// console.log("--------------------------------------------------initializeDatabase------------------------------------------------------- ", err);

// نمونه داده دریافتی


const sampleData = {
    id: 1,
    SerialNumber: 'SN12345',
    customerName: 'John',
    RegionName: 'Tehran',
    ReceiveDate: new Date(),
    AverageDailyFlow: 100.5,
    PositiveVolume: 200.5,
    NegativeVolume: 50.,
    NetVolume: 150.5
};


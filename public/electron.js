const path = require("path");
const url = require("url");
const { app, BrowserWindow } = require("electron");
const electron = require("electron");
const Store = require("electron-store");
const chokidar = require("chokidar");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
const util = require("util");
const exec = util.promisify(require("child_process").exec);


const {connectToLocalDatabase,connectToSourceDatabase} = require('./dbConfig');
const sql = require('mssql');
// dfg/
const ipc = electron.ipcMain;

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

    async function executeQuery() {
        try {
            const result = await sql.query('SELECT TOP 50 * FROM AllDatas'); 

            // console.log(result.recordset); 
            return result.recordset;
        } catch (err) {
            console.error('Error executing query:', err);
        } 
    }

    executeQuery().then(result => {
        // console.log("-------result---------", result);
    });

    const store = new Store();
    const dir = path.join(app.getPath("userData"), "store", "");
    console.log("stage", process.env.APP_STAGE);
}

app.on("ready", async () => {

    await connectToSourceDatabase("mola","1234")
    await connectToLocalDatabase()

    createWindow();
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

ipc.on("exit", async (event, payload) => { });

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

ipc.on("set:upload", async (event) => {
    stopFlag = false;
    if (!stopFlag) {
        inter = setInterval(async () => {
            if (!stopFlag) {
                await checkForNewDataAndSend();
            }
        }, 10000);
    }
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
    try {
        let pool = await sql.connect(sqlConfig);
        
        const result = await pool.request()
            .input('lastId', sql.Int, lastCheckedId)
            .query(`
                SELECT * FROM AllDatas
                WHERE Id > @lastId
                ORDER BY Id ASC
            `);
        
        const newRecords = result.recordset;
        
        if (newRecords.length > 0) {
            for (let record of newRecords) {
                try {
                    await axios.post(targetUrl, record, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    console.log(`Data sent successfully: ${record.Id}`);
                    electron.ipcRenderer.send('set:upload', record);
                    lastCheckedId = record.Id;
                } catch (error) {
                    console.error("Error in sending data", error.message);
                }
            }
        } else {
            console.log("No new records found.");
        }
    } catch (error) {
        console.error("Error in fetching data from database", error.message);
    }
}
/////////////////////////////////////////////////////////////
/*

const sql = require('mssql');

const config = {
    user: 'your_username',
    password: 'your_password',
    server: 'your_server', // e.g. 'localhost'
    database: 'testdb',
};

async function initializeDatabase() {
    try {
        let pool = await sql.connect(config);
        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'allDate')
            CREATE TABLE allDate (
                id INT PRIMARY KEY,
                SerialNumber NVARCHAR(50),
                customerName NVARCHAR(100),
                RegionName NVARCHAR(100),
                reciveData DATETIME,
                AverageDaylyFlow FLOAT,
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
    try {
        let pool = await sql.connect(config);
        const { id, SerialNumber, customerName, RegionName, reciveData, AverageDaylyFlow, PositiveVolume, NegativeVolume, NetVolume } = data;

        const query = `
            INSERT INTO allDate (id, SerialNumber, customerName, RegionName, reciveData, AverageDaylyFlow, PositiveVolume, NegativeVolume, NetVolume)
            VALUES (@id, @SerialNumber, @customerName, @RegionName, @reciveData, @AverageDaylyFlow, @PositiveVolume, @NegativeVolume, @NetVolume)
        `;

        await pool.request()
            .input('id', sql.Int, id)
            .input('SerialNumber', sql.NVarChar, SerialNumber)
            .input('customerName', sql.NVarChar, customerName)
            .input('RegionName', sql.NVarChar, RegionName)
            .input('reciveData', sql.DateTime, reciveData)
            .input('AverageDaylyFlow', sql.Float, AverageDaylyFlow)
            .input('PositiveVolume', sql.Float, PositiveVolume)
            .input('NegativeVolume', sql.Float, NegativeVolume)
            .input('NetVolume', sql.Float, NetVolume)
            .query(query);

        console.log("Data inserted successfully");
    } catch (err) {
        console.error("Error inserting data: ", err);
    }
}

// فراخوانی تابع برای راه‌اندازی دیتابیس
initializeDatabase();

// نمونه داده دریافتی
const sampleData = {
    id: 1,
    SerialNumber: 'SN12345',
    customerName: 'John Doe',
    RegionName: 'Tehran',
    reciveData: new Date(),
    AverageDaylyFlow: 100.5,
    PositiveVolume: 200.5,
    NegativeVolume: 50.,
    NetVolume: 150.5
};

// فراخوانی تابع برای وارد کردن داده
insertData(sampleData);
*/
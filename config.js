require('dotenv').config();
const fs = require('fs');


const ConfigOptions = {
    port: process.env.PORT,
    key: fs.readFileSync("./certs/example.key"),
    cert: fs.readFileSync("./certs/example.crt"),
    app_id: process.env.APP_ID,
    app_key: process.env.APP_KEY,
}

module.exports=ConfigOptions

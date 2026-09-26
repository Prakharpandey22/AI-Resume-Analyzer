// const dns = require("dns");

// dns.setServers(["8.8.8.8", "8.8.4.4"]);

// require("dotenv").config()
// const app = require("./src/app")
// const connectToDB = require("./src/config/database")

// const {resume, jobDescription, selfDescription} = require("./src/services/temp")
 
// const generateInterviewReport = require("./src/services/ai.service")

// connectToDB();

// generateInterviewReport({resume, selfDescription, jobDescription})

// app.listen(3000,()=>{
//     console.log("Server is running on port 3000")
// })


const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const app = require("./src/app");
const connectToDB = require("./src/config/database");

const {
    resume,
    selfDescription,
    jobDescription
} = require("./src/services/temp");

const generateInterviewReport = require("./src/services/ai.service");

connectToDB();

// generateInterviewReport({
//     resume,
//     selfDescription,
//     jobDescription
// })
// .then((result) => {
//     console.log("✅ FINAL REPORT:");
//     console.log(JSON.stringify(result, null, 2));
// })
// .catch((error) => {
//     console.error("❌ AI ERROR:");
//     console.error(error);
// });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const router = require("./backend/routes/routes");

const app = express();

app.use(cors());
app.use(compression());
app.set("views", __dirname + "/client/views")
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/client"));
app.use("/", router);

app.listen(5500, _=>{
    console.log("Server listening on port 5500");
});
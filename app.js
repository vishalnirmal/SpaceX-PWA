const express = require("express");
const cors = require("cors");
const compression = require("compression");
const router = require("./backend/routes/routes");
const PORT = process.env.PORT || 5500;

const app = express();

app.use(cors());
app.use(compression());
app.set("views", __dirname + "/client/views")
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/client"));
app.use("/", router);

app.listen(PORT, _=>{
    console.log(`Server listening on port ${PORT}`);
});
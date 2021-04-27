const express = require("express");
const cors = require("cors");
const compression = require("compression");
const mongoose = require("mongoose");
const router = require("./backend/routes/routes");
const PORT = process.env.PORT || 5500;

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then(_ => console.log("Connected to database."))
.catch(console.log);

const app = express();

app.use(express.json());
app.use(cors());
app.use(compression());
app.set("views", __dirname + "/client/views")
app.engine("html", require("ejs").renderFile);
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/client/assets"));
app.use("/", router);

app.listen(PORT, _=>{
    console.log(`Server listening on port ${PORT}`);
});
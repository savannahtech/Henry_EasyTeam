"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var dotenv_1 = __importDefault(require("dotenv"));
var cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
var app = (0, express_1.default)();
mongoose_1.default
    .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(function () { return console.log("DB Connection Successful!"); })
    .catch(function (err) {
    console.error(err);
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// app.use("/api/products", productRoute);
var port = parseInt(process.env.PORT, 10) || 5000;
app.get("/", function (req, res) {
    res.send("Hello, world!");
});
app.listen(port, function () {
    console.log("Server is running on port " + port);
});

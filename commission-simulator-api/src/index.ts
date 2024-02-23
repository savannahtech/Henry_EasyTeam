import express, {Application, Request, Response} from "express";
import mongoose, {ConnectOptions} from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
const productRoute = require("./routes/productRoute");
const ordersRoute = require("./routes/ordersRoute");
const staffMembersRoute = require("./routes/staffMembersRoute");

dotenv.config();

const app: Application = express();

mongoose
  .connect(
    process.env.MONGO_URL as string,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions
  )
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.error(err);
  });

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoute);
app.use("/api/orders", ordersRoute);
app.use("/api/staff-members", staffMembersRoute);

const port: number = parseInt(process.env.PORT as string, 10) || 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});

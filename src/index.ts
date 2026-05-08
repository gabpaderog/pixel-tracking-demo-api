import express from "express";
import router from "./modules/tracking/tracking.route.js";
import requestIp from "request-ip";
import cors from "cors";

const app = express();
const port = "3000";
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.set("trust proxy", true);
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use(requestIp.mw());
app.use("/tracking", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

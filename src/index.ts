import express from "express";
import router from "./modules/tracking/tracking.route.js";

const app = express();
const port = "3000";

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
});

app.use("/tracking", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require("express");
const { apiRouter } = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connectDB } = require("./config/db");
const port = 4000;

const app = express();
// mongodb connection
connectDB();

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin or matching localhost/127.0.0.1 on any port
      if (!origin || /https?:\/\/localhost(:\d+)?$/.test(origin) || /https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

// to get req.cookies
app.use(cookieParser());

app.use("/api", apiRouter);


app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});


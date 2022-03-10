require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
// const errorHandler = require("./middleware/error")

// Connect DB
connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", require("./routes/auth"));
app.use("/private", require("./routes/private"));

// Error Handler (Should be last piece of middleware)
// app.use(errorHanlder)

const PORT = process.env.PORT || 6000;
const server = app.listen(PORT, () => console.log(`Server running on ${PORT}`));

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});

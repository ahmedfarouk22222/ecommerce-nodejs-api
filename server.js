const path = require("path");
const express = require("express");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config({ path: "config.env" });

const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const ApiError = require("./utils/api_error");
const dbConnection = require("./config/database");
const globalError = require("./middlewares/error_middlewares");
const mountRoutes = require("./routes/index");

// DB Connection
dbConnection();
const app = express();
app.use(cors());
app.use(compression());
app.options("/{*splat}", cors());
app.set("query parser", "extended");

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
mountRoutes(app);

app.all("/*splat", (req, res, next) => {
  const err = new ApiError(
    `Can't find ${req.originalUrl} on this server!`,
    400,
  );
  next(err);
});

app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
  console.log(`UnhandledRejection Errors:${err.name} |${err.message} `);
  server.close(() => {
    console.error("Shutting down...........");
    process.exit(1);
  });
});

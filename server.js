const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/api_error");
const dbConnection = require("./config/database");
const globalError = require("./middlewares/error_middlewares");
const mountRoutes = require("./routes/index");
//DBConnection
dbConnection();

const app = express();
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

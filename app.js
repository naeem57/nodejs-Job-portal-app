const express = require("express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("express-async-errors");
const connectDB = require("./config/db.js");
const errorMiddleware = require("./middlewares/error-middleware.js");
require("dotenv").config();

const app = express();

//import routes
const authRoutes = require("./routes/auth-route.js");
const userRoutes = require("./routes/user-routes.js");
const jobsRoutes = require("./routes/jobs-routes.js");

//connect DB
connectDB();

// Swagger JSDoc configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node expressJs Job Portal Application",
    },
    servers: [
      {
        url: "http://localhost:6000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

// Generate Swagger docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/job", jobsRoutes);
// Serve Swagger UI
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});

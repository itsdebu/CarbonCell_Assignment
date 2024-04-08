const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectdb = require("./Config/DbConnection");
// const swaggerDocs = require('./swagger');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRoutes = require("./Router/userRouter")
const dataFetchRouter = require("./Router/DataFetchRouter");

dotenv.config();   // Load environment variables from .env file

// Connection to mongodb
connectdb();

// Initializing port
const port = process.env.PORT || 8800;

// Connecting to express server
app.listen(port, (req, res) => {

    console.log(`server is running on ${port}`)
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentation for your API endpoints',
        },
        servers: [
            {
                url: 'http://localhost:8800', // Update with your server URL
                description: 'Development server',
            },
        ],
    },
    apis: [`./Router/userRouter.js`], // Path to the API router files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use("/api/user", userRoutes) // User Authentication route
app.use("/api/data", dataFetchRouter); // Data fetching route
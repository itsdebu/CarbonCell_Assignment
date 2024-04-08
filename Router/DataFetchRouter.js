const express = require("express");
const router = express.Router();
const { getFilteredData } = require("../Controllers/dataFetchController");
const { validateToken } = require("../Middleware/validateToken");

// Endpoint to fetch filtered data
router.get('/fetch', validateToken, getFilteredData);

module.exports = router;

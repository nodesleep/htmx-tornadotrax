const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");

// Dotenv Config
dotenv.config({ path: ".env.local" });

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index", { data: [], query: {} });
});

app.post("/filter", async (req, res) => {
    const { startDate, endDate, mag, state } = req.body;

    const requestData = {
        startDate,
        endDate,
        mag: mag
            ? mag
                  .split(",")
                  .map((m) => m.trim())
                  .join(",")
            : undefined,
        state: state
            ? state
                  .split(",")
                  .map((s) => s.trim())
                  .join(",")
            : undefined,
    };

    try {
        const response = await axios.post(process.env.API_BACKEND, requestData);
        const data = response.data.data;
        res.render("partials/_rows", { data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.render("partials/_rows", { data: [] });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

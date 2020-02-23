const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./config/database.config");
const request = require("supertest");
// const logger = require("morgan");

// Express APIs
const api = require('./app/routes/auth.routes');

// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
    }
)

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);

// Express settings
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send({ message: "Yabadabadooo" });
});

// Serve static resources
app.use('/public', express.static('public'));

app.use('/api/v1', api)

// Define PORT
const port = process.env.PORT || 5004;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong!!!'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

module.exports = server;
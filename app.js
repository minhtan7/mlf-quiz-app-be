var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors")
require("dotenv").config()

var indexRouter = require('./routes/index');

const mongoose = require('mongoose');
const { sendResponse } = require('./helpers/utils.helper');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/api', indexRouter);

//catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error("404 - Resource not found");
    next(err);
});

//Initialize Error handling
app.use((err, req, res, next) => {
    console.log("ERROR", err);
    const statusCode = err.message.split(" - ")[0];
    const message = err.message.split(" - ")[1];
    if (!isNaN(statusCode)) {
        sendResponse(res, statusCode, false, null, { message }, null);
    } else {
        sendResponse(
            res,
            500,
            false,
            null,
            { message: err.message },
            "Internal Server Error"
        );
    }
});

module.exports = app;

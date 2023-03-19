var express = require('express');
var router = express.Router();

const testApi = require("./test")
router.use("/tests", testApi)

const categoryApi = require("./category")
router.use("/categories", categoryApi)

const questionApi = require("./question")
router.use("/questions", questionApi)

const attemptApi = require("./attempt")
router.use("/attempts", attemptApi)


module.exports = router;
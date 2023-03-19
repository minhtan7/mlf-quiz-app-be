const express = require('express')
const attemptController = require("../controllers/controller.attempt")
const router = express.Router()

router.post("/", attemptController.createAttempt)
router.get("/", attemptController.getAttempts)


module.exports = router
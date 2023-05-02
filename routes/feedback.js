const express = require('express')
const feedbackController = require('../controllers/controller.feedback')
const router = express.Router()

router.post("/", feedbackController.createCategory)

module.exports = router
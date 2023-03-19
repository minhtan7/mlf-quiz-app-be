const express = require('express')
const questionController = require('../controllers/controller.question')

const router = express.Router()

router.post("/multipleChoice", questionController.createMultipleChoiceQuestion)
router.put("/:id", questionController.updateQuestion)
router.get("/", questionController.getQuestions)


module.exports = router
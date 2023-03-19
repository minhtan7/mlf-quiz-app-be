const express = require('express')
const testController = require('../controllers/controller.test')
const router = express.Router()

router.post("/", testController.createTest)
router.get('/', testController.getTests)
router.get("/:slug", testController.getTestBySlug)
router.put("/:id", testController.updateTest)

module.exports = router
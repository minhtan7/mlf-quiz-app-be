const express = require('express')
const attemptController = require("../controllers/controller.attempt")
const authMiddleware = require('../middlewares/authentication')
const router = express.Router()

router.post("/", authMiddleware.loginRequired, attemptController.createAttempt)
router.get("/", authMiddleware.loginRequired, attemptController.getAttempts)
router.get("/:id", authMiddleware.loginRequired, attemptController.getAttemptById)


module.exports = router
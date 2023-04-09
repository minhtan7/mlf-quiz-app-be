const express = require('express')
const leadController = require('../controllers/controller.lead')
const authMiddleware = require('../middlewares/authentication')


const router = express.Router()

router.post("/", leadController.register)
router.get("/me", authMiddleware.loginRequired, leadController.getCurrentLead)

module.exports = router
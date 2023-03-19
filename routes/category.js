const express = require('express')
const categoryController = require("../controllers/controller.category")
const router = express.Router()

router.post("/", categoryController.createCategory)
router.get("/", categoryController.getCategories)


module.exports = router
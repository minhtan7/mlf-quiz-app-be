const express = require("express");
const router = express.Router();
const validators = require("../middlewares/validators");
const { body } = require("express-validator");
const authController = require("../controllers/controller.auth");


router.post(
    "/login",
    validators.validate([
        body("email", "Invalid email")
            .exists()
            .isEmail()
            .normalizeEmail({ gmail_remove_dots: false }),
        body("password", "Invalid password").exists().notEmpty(),
    ]),
    authController.loginWithEmail
);

module.exports = router;
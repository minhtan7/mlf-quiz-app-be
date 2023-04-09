const {
    AppError,
    catchAsync,
    sendResponse,
} = require("../helpers/utils.helper");
const Lead = require("../model/Lead");
const bcrypt = require("bcryptjs");
const authController = {};



authController.loginWithEmail = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const lead = await Lead.findOne({ email }, "+password");
    if (!lead)
        return next(new AppError(400, "Invalid credentials", "Login Error"));

    const isMatch = await bcrypt.compare(password, lead.password);
    if (!isMatch) return next(new AppError(400, "Wrong password", "Login Error"));

    const accessToken = await lead.generateToken();
    return sendResponse(
        res,
        200,
        true,
        { lead, accessToken },
        null,
        "Login successful"
    );
});

module.exports = authController;
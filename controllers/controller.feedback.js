const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper");
const Feedback = require("../model/Feedback");

const feedbackController = {}


feedbackController.createCategory = catchAsync(async (req, res, next) => {
    Feedback.create({ ...req.body });
    return sendResponse(res, 200, true, null, false, "Feedback created.")
})




module.exports = feedbackController

const { createSlug } = require("../helpers/slug.helper");
const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper")
const Test = require("../model/Test");
const APIFeature = require("../utils/apiFeature")



const testController = {}

testController.getTests = catchAsync(async (req, res, next) => {
    let features = new APIFeature(Test.find(), req.query).filter().sortFields().limitFields()
    const totalTest = await features.query.countDocuments()
    const totalPage = Math.ceil(totalTest / (parseInt(req.query.limit) || 9))
    page = parseInt(req.query.page) || 1

    features = new APIFeature(Test.find(), req.query).filter().sortFields().limitFields().paginate()
    const tests = await features.query.populate("questions")

    sendResponse(res, 200, true, { tests, totalPage, page, totalTest }, null, "Get Tests")
})

testController.getTestBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params
    const test = await Test.findOne({ slug }).populate("questions")
    if (!test) throw new AppError(404, "Test not found");
    sendResponse(res, 200, true, test, null, "Get single Test by slug")
})

testController.createTest = catchAsync(async (req, res, next) => {
    const { title, questions, slug } = req.body;
    console.log(req.body)
    // let test = await Test.findOne({ slug })
    // if (test) throw new AppError(400, "Test does exist.")
    const test = await new Test({
        title
    });
    await test.save()
    return sendResponse(res, 200, true, test, false, "Test created.")
})

testController.updateTest = catchAsync(async (req, res, next) => {
    const { title, questions, slug } = req.body;
    let test = await Test.findOne({ slug })
    if (!test) throw new AppError(400, "Test not found.")
    test = await Test.findOneAndUpdate({ slug }, {
        title,
        questions
    }, { new: true });
    sendResponse(res, 200, true, test, false, "Test created.")
})

testController.addQuestionToTests = catchAsync(async (req, res, next) => {
    const testId = req.params.testId
    const { questionIds } = req.body

    let test = await Test.findById(testId)
    if (!test) throw new AppError("404", "Test not found.")
    test.questions = questionIds
    await test.save()
    sendResponse(res, 200, true, test, false, "Update test's questions.")
})


module.exports = testController

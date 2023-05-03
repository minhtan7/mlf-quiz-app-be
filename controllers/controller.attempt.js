const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper");
const Lead = require("../model/Lead");
const Attempt = require("../model/Attempt");
const { Test } = require("../model/Test");
const { Question } = require("../model/Question");
const { equalsArray } = require("../helpers/method.helper");
const APIFeature = require("../utils/apiFeature");

const attemptController = {}

attemptController.getAttempts = catchAsync(async (req, res, next) => {
    const id = req.leadId
    const query = { ...req.query, lead: id }
    let features = new APIFeature(Attempt.find(), query).filter().sortFields().limitFields()
    const totalAttempts = await features.query.countDocuments()
    const totalPage = Math.ceil(totalAttempts / (parseInt(req.query.limit) || 9))
    page = parseInt(req.query.page) || 1

    features = new APIFeature(Attempt.find(), query).filter().sortFields().limitFields().paginate()
    const attempts = await features.query.populate("test").populate("lead").populate({ path: "answers", populate: "question" })
    sendResponse(res, 200, true, { attempts, totalPage, page, totalAttempts }, null, "Get Attempts")
})

attemptController.getAttemptById = catchAsync(async (req, res, next) => {
    const attemptId = req.params.id
    const attempt = await Attempt.findById(attemptId).populate({ path: "test", populate: { path: "category", select: "name slug" } }).populate("lead").populate({ path: "answers", populate: "question" })
    if (!attempt) return next(new AppError(404, "Attempt not found", "Get attempt Error"));
    sendResponse(res, 200, true, attempt, null, "Get Attempt")

})

attemptController.createAttempt = catchAsync(async (req, res, next) => {
    const leadId = req.leadId
    const { testId, answers, takingTime, testType } = req.body
    let lead = await Lead.findById(leadId)

    let wrongAnswer = 0
    // const leadDoc = await Lead.findById(lead)
    //missing handle case where lead not exista
    //missing handle case where test not exist

    const questionsIds = answers.map(a => a.question)
    const questions = await Question.find({ _id: { $in: questionsIds } }).select("_id type options answers").lean()


    const questionMap = new Map()
    questions.forEach(q => questionMap.set(q._id.toString(), q))
    let score = 0
    const totalQuestion = answers.length
    answers.forEach(answer => {
        const question = questionMap.get(answer.question)
        if (question.type === 'MultipleChoice' | question.type === 'FillInTheBlank') {
            if (equalsArray(answer.userAnswer, question.answers)) {
                score++
                answer.result = true
            } else if (answer.userAnswer.length == 0) {
                answer.result = false
            } else {
                wrongAnswer++
                answer.result = false
            }
        }
    })
    // const questions = await Question.find({ _id: { $in: answers.question } })

    // const result = answers.map(a => a.question.isAnswerCorrect(a.userAnswer))
    // console.log(result)
    // const score = result.reduce((total, r) => total += r ? 1 : 0, 0)

    let attempt = await Attempt.create({
        lead: lead._id, test: testId, answers, score, totalQuestion, takingTime, testType,
        wrongAnswer
    })

    return sendResponse(res, 200, true, attempt, false, "Attempt created.")
})



module.exports = attemptController

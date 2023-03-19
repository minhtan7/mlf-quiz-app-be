const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper");
const Lead = require("../model/Lead");
const Attempt = require("../model/Attempt");
const { Question } = require("../model/Question");
const { equalsArray } = require("../helpers/method.helper")

const attemptController = {}

attemptController.getAttempts = catchAsync(async (req, res, next) => {
})

attemptController.getAttemptBySlug = catchAsync(async (req, res, next) => {

})

attemptController.createAttempt = catchAsync(async (req, res, next) => {
    const { email, name, job, test, answers } = req.body

    let lead = await Lead.findOne({ email })
    if (!lead) {
        lead = await Lead.create({
            email, name, job
        })
    }
    // const leadDoc = await Lead.findById(lead)
    //missing handle case where lead not exist
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
            }
            answer.result = false
        }
    })
    // const questions = await Question.find({ _id: { $in: answers.question } })

    // const result = answers.map(a => a.question.isAnswerCorrect(a.userAnswer))
    // console.log(result)
    // const score = result.reduce((total, r) => total += r ? 1 : 0, 0)

    let attempt = await Attempt.create({
        lead, test, answers, score, totalQuestion
    })

    return sendResponse(res, 200, true, attempt, false, "Attempt created.")
})



module.exports = attemptController

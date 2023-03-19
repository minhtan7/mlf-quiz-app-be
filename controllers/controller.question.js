const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper");
const Category = require("../model/Category");
const { MultipleChoice, Question } = require("../model/Question");
const Test = require("../model/Test");
const APIFeature = require("../utils/apiFeature");


const questionController = {}

questionController.getQuestions = catchAsync(async (req, res, next) => {
    let features = new APIFeature(Question.find(), req.query).filter().sortFields().limitFields()
    const totalQuestions = await features.query.countDocuments()
    const totalPage = Math.ceil(totalQuestions / (parseInt(req.query.limit) || 9))
    page = parseInt(req.query.page) || 1

    features = new APIFeature(Question.find(), req.query).filter().sortFields().limitFields().paginate()
    const questions = await features.query.populate("topic")

    sendResponse(res, 200, true, { questions, totalPage, page, totalQuestions }, null, "Get Questions")
})

questionController.createMultipleChoiceQuestion = catchAsync(async (req, res, next) => {
    const { questionText, explanation, categoryIds, options, answers, testId } = req.body

    let test = await Test.findById(testId)
    if (!test) throw new AppError("404", "Test not found.")

//check if categories exist
    await Promise.all([categoryIds.forEach(async slugId => {
        const cat = await Category.findById(slugId)
        if (!cat) throw new AppError("400", "Category not found.")
    })])


    const question = await MultipleChoice.create({
        questionText,
        explanation,
        categories: categoryIds,
        options,
        answers,
        test: testId
    })
    test.questions.push(question)
    test.save()
    sendResponse(res, 200, true, question, null, "Question created.")
})

questionController.updateQuestion = catchAsync(async (req, res, next) => {
    const questionId = req.params.id
    const { testId, questionText, explanation, categories, options, answers, type } = req.body

    let question = await Question.findById(questionId)
    if (!question) throw new AppError("400", "Question not found.")

    let test = await Test.findById(testId)
    if (!test) throw new AppError("404", "Test not found.")

    if (categories?.length) {
        await Promise.all(categories.forEach(async slugId => {
            const cat = await Category.findById(slugId)
            if (!cat) throw new AppError("400", "Category not found.")
        }))
    }
    if (!question.test.includes(testId)) question.test.push(testId)
    if (questionText) question.questionText = questionText;
    if (explanation) question.explanation = explanation;
    if (categories) question.categories = categories;
    if (options) question.options = options;
    if (answers) question.answers = answers;
    await question.save()

    test.questions.push(question)
    test.save()
    // question = await Question.findOneAndUpdate(
    //     { _id: questionId },
    //     {
    //         options,
    //         answers,
    //         $set: {
    //             questionText,
    //             explanation,
    //             categories,
    //         },
    //     },
    //     { new: true }
    // );

    sendResponse(res, 200, true, question, null, "Question updated.")

})

module.exports = questionController

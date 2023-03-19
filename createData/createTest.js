const Category = require("../model/Category");
const { MultipleChoice } = require("../model/Question");
const Test = require("../model/Test");
const APIFeature = require("../utils/apiFeature");
const db = require("./db.json")


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/quiz');
}


const createTestnQuestions = async (db) => {
    const { title, questions } = db
    const test = await createTest(title)
    createQuestions(test, questions)
}

const createTest = async (title) => {
    const test = await new Test({
        title
    });
    await test.save()
    return test
}

const CATS = {
    terminology: "6415f9ed72f84e4e09f1799d"
}

const createQuestions = async (test, questions) => {
    const questionIds = []
    await Promise.all(questions.map(async question => {
        const { questionText, explanation, categories, options, answers, type } = question
        const catIds = categories.map(c => CATS[c])
        if (type === "MultipleChoice") {
            const question = await MultipleChoice.create({
                questionText,
                explanation,
                categories: catIds,
                options,
                answers,
                test: test._id
            })
            questionIds.push(question._id)
        }
    }))
    test.questions = questionIds
    await test.save()
}

createTestnQuestions(db)
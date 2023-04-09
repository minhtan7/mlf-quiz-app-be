const { createSlug } = require("../helpers/slug.helper");
const Category = require("../model/Category");
const { MultipleChoice, Question } = require("../model/Question");
const Test = require("../model/Test");
const APIFeature = require("../utils/apiFeature");
const db = require("./question.json")


const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/quiz');
}


const createTestnQuestions = async (db) => {
    Test.collection.drop()
    Question.collection.drop()
    for (let key in db) {
        let { title, questions, category, duration } = db[key]
        duration = questions.length * duration
        const test = await createTest(title, duration, category)
        await createQuestions(test, questions)
    }
}

const CATS = {
    "academic terminology": "6415f9ed72f84e4e09f1799d",
    "medical terminology": "642c1a1d5c5ec2c6dab54796",
    "New General Service List": "64309013780b77e115d4d900"
}
const createTest = async (title, duration, category) => {

    const test = await new Test({
        title, duration, category: CATS[category]
    });

    await test.save()
    return test
}


const createQuestions = async (test, questions) => {
    const questionIds = []
    await Promise.all(questions.map(async question => {
        let { questionText, explanation, categories, options, answers, type, inputType } = question
        inputType = inputType ? inputType : "radio"
        const catIds = categories.map(c => CATS[c])
        if (type === "MultipleChoice") {
            const question = await MultipleChoice.create({
                questionText,
                explanation,
                categories: catIds,
                options,
                answers,
                test: test._id,
                inputType
            })
            questionIds.push(question._id)
        }
    }))
    test.questions = questionIds
    await test.save()
}

createTestnQuestions(db).then(console.log("success"))
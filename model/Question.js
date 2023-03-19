const { Schema, model } = require("mongoose");


const questionSchema = Schema({
    questionText: { type: String, required: true },
    explanation: { type: String },
    categories: { type: [Schema.Types.ObjectId], ref: "Category" },
    test: { type: [Schema.Types.ObjectId], ref: "Test", require: true, default: [] }
}, {
    timestamps: true,
    discriminatorKey: "type",
})

const multipleChoiceSchema = Schema({
    options: { type: [String], require: true },
    answers: { type: [Number], require: true }
})

const fillInTheBlankSchema = Schema({
    answers: { type: [String], require: true }
})


questionSchema.methods.isAnswerCorrect = function (answers) { //array
    if (this.type === 'MultipleChoice' | this.type === 'FillInTheBlank') {
        if (this.answers.length !== answers.length) return false
        for (let i = 0; i < answers.length; i++) {
            if (!this.answers.includes(answers[i].toString())) {
                return false
            }
        }
    }
    return true;
};

const Question = new model("Question", questionSchema)
const MultipleChoice = Question.discriminator("MultipleChoice", multipleChoiceSchema)
const FillInTheBlank = Question.discriminator("FillInTheBlank", fillInTheBlankSchema)


module.exports = { Question, MultipleChoice, FillInTheBlank }
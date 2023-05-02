const { Schema, model } = require("mongoose");

const attemptPartSchema = new Schema({
    part: { type: Schema.Types.ObjectId, ref: 'TestPart', required: true },
    answers: [
        {
            question: { type: Schema.Types.ObjectId, ref: 'Question' },
            userAnswer: { type: [Schema.Types.Mixed] },
            result: { type: Boolean, require: true }
        }
    ]
});

const attemptSchema = Schema({
    lead: { type: Schema.Types.ObjectId, ref: "Lead", require: true },
    test: { type: Schema.Types.ObjectId, ref: "Test", require: true },
    answers: [
        {
            question: { type: Schema.Types.ObjectId, ref: "Question" },
            userAnswer: { type: [Schema.Types.Mixed] },
            result: { type: Boolean }
        }
    ],
    takingTime: { type: Number, require: true, default: 0 }, //save seconds
    score: { type: Number, require: true, default: 0 },
    totalQuestion: { type: Number, require: true, default: 0 },
    testType: {
        type: String,
        required: true,
        enum: ['plain', 'reading', 'listening'] // add other test types here
    },
    parts: { type: [attemptPartSchema] },
}, {
    discriminatorKey: "testType",
    timestamps: true
})



attemptSchema.methods.countResults = function () {
    let trueCount = 0;
    let falseCount = 0;
    let unansweredCount = 0;

    this.answers.forEach((answer) => {
        if (answer.userAnswer.length === 0) {
            unansweredCount++;
        } else if (answer.result) {
            trueCount++;
        } else {
            falseCount++;
        }
    });

    return {
        trueCount,
        falseCount,
        unansweredCount,
    };
};

const Attempt = new model("Attempt", attemptSchema)
module.exports = Attempt
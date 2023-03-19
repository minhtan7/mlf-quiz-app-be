const { Schema, model } = require("mongoose");

const attemptSchema = Schema({
    lead: { type: Schema.Types.ObjectId, ref: "Lead", require: true },
    test: { type: Schema.Types.ObjectId, ref: "Test", require: true },
    answers: [
        {
            question: { type: Schema.Types.ObjectId, ref: "Question" },
            userAnswer: { type: [Schema.Types.Mixed] },
            result: { type: Boolean, require: true }
        }
    ],
    score: { type: Number, require: true, default: 0 },
    totalQuestion: { type: Number, require: true, default: 0 },
})

const Attempt = new model("Attempt", attemptSchema)
module.exports = Attempt
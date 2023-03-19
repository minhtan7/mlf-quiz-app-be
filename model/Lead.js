const { Schema, model } = require("mongoose");

const leadSchema = Schema({
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true, trim: true },
    job: {
        type: String,
        require: true,
        enum: ["Sinh viên", "Bác sĩ", "Khác"],
        default: "Khác"
    },
    attempts: [
        {
            test: { type: Schema.Types.ObjectId, ref: "Test" },
            noOfTry: { type: Number },
            attempt: { type: Schema.Types.ObjectId, ref: "Attempt" }
        }
    ]
}, {
    timestamps: true
})

const Lead = new model("Lead", leadSchema)
module.exports = Lead
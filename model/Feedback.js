const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    formType: {
        type: String,
        enum: ["testFb"],
        required: true,
    },
    formData: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    lead: { type: mongoose.Types.ObjectId, ref: "Lead", required: true }

}, {
    timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);
const { Schema, model } = require("mongoose");
const { createSlug } = require("../helpers/slug.helper");

const baseTestSchema = new Schema({
    title: { type: String, require: true, trim: true },
    description: { type: String },
    slug: { type: String, require: true, trim: true, lowercase: true, unique: true },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question', require: true, default: [] },
    duration: { type: Number, require: true, default: 0 }, //seconds
    category: { type: Schema.Types.ObjectId, ref: 'Category', require: true, default: null },
    displaySlug: { type: String },
    testType: {
        type: String,
        required: true,
        enum: ['plain', 'reading', 'listening']
    }
}, {
    timestamps: true,
    discriminatorKey: 'testType'
});

const testPartSchema = new Schema({
    title: { type: String, trim: true },
    content: { type: String },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question', required: true },
    audioLink: { type: String }
});

const readingPartSchema = new Schema({
    title: { type: String, trim: true },
    content: { type: String },
    questions: { type: [Schema.Types.ObjectId], ref: 'Question', required: true },
});


// Multiple choice test schema
const plainTestSchema = new Schema({});

// Reading test schema
const readingTestSchema = new Schema({
    parts: { type: [readingPartSchema], required: true }
});

// Listening test schema
const listeningTestSchema = new Schema({
    parts: { type: [testPartSchema], required: true }
});



baseTestSchema.pre('save', async function (next) {
    if (!this.slug) {
        let index = 0;
        let unique = false;
        while (!unique) {
            const potentialSlug = createSlug(this.title, index);

            const existingTest = await Test.findOne({ slug: potentialSlug });
            if (!existingTest) {
                unique = true;
                this.slug = potentialSlug;
            } else {
                index++;
            }
        }
    }

    next();
});

const Test = model('Test', baseTestSchema);
const PlainTest = Test.discriminator('plain', plainTestSchema);
const ReadingTest = Test.discriminator('reading', readingTestSchema);
const ListeningTest = Test.discriminator('listening', listeningTestSchema);

module.exports = { Test, PlainTest, ReadingTest, ListeningTest };
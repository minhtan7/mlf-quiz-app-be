const { Schema, model } = require("mongoose");
const { createSlug } = require("../helpers/slug.helper");

const testSchema = Schema({
    title: { type: String, require: true, trim: true },
    questions: { type: [Schema.Types.ObjectId], ref: "Question", require: true, deffault: [] },
    slug: { type: String, require: true, trim: true, lowercase: true, unique: true }
}, {
    timestamps: true
})

testSchema.pre('save', async function (next) {
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

const Test = new model("Test", testSchema)
module.exports = Test
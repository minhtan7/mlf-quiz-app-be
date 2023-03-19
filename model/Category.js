const { Schema, model } = require("mongoose");
const { createSlug } = require("../helpers/slug.helper");

const categorySchema = Schema({
    name: { type: String, require: true, unique: true },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null
    },
    slug: { type: String, unique: true }
}, {
    timestamps: true
})

categorySchema.pre('save', async function (next) {
    const slug = createSlug(this.name);
    this.slug = slug
    next();
});

const Category = new model("Category", categorySchema)
module.exports = Category
const { catchAsync, sendResponse, AppError } = require("../helpers/utils.helper");
const Category = require("../model/Category");
const APIFeature = require("../utils/apiFeature");

const categoryController = {}

categoryController.getCategories = catchAsync(async (req, res, next) => {
    let features = new APIFeature(Category.find(), req.query).filter().sortFields().limitFields()
    const totalCategory = await features.query.countDocuments()
    const totalPage = Math.ceil(totalCategory / (parseInt(req.query.limit) || 9))
    page = parseInt(req.query.page) || 1

    features = new APIFeature(Category.find(), req.query).filter().sortFields().limitFields().paginate()
    const categories = await features.query

    sendResponse(res, 200, true, { categories, totalPage, page, totalCategory }, null, "Get Categories")
})

categoryController.getCategoryTestBySlug = catchAsync(async (req, res, next) => {
    const { slug } = req.params
    const category = await Category.findOne({ slug })
    if (!category) throw new AppError(404, "Category not found");
    sendResponse(res, 200, true, category, null, "Get single Category by slug")
})

categoryController.createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    let category = await Category.findOne({ name })
    if (category) throw new AppError("400", "Category does exist")
    category = await new Category({
        name
    });
    await category.save()
    return sendResponse(res, 200, true, category, false, "Category created.")
})

categoryController.updateCategory = catchAsync(async (req, res, next) => {
    const { name, slug } = req.body;
    let category = await Category.findOne({ slug })
    if (!category) throw new AppError(400, "Category not found.")
    category = await Category.findOneAndUpdate({ slug }, {
        name
    }, { new: true });
    sendResponse(res, 200, true, category, false, "Category updated.")
})


module.exports = categoryController

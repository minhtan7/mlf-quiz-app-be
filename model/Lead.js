const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const leadSchema = Schema({
    email: { type: String, require: true, unique: true },
    name: { type: String, require: true, trim: true },
    password: { type: String, required: true, select: false },
    job: {
        type: String,
        require: true,
        enum: ["Sinh viên năm 1-2", "Sinh viên năm 3-4", "Sinh viên năm 5-6",
            "Bác sĩ", "Y sĩ", "Dược sĩ", "Điều dưỡng", "Kỹ thuật viên",
            "Giáo viên/ Giảng viên", "Nghiên cứu sinh",
            "Thư ký y khoa", "Kinh doanh Y khoa", "Chăm sóc khách hàng", "Khác"],
        default: "Khác",
    },
    isDeleted: { type: Boolean, default: false, select: false },
}, {
    timestamps: true
})

leadSchema.plugin(require("./plugins/isDeletedFalse"));

leadSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    delete obj.isDeleted;
    return obj;
};

leadSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    return accessToken;
};

const Lead = new model("Lead", leadSchema)
module.exports = Lead
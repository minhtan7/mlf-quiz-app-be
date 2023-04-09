const bcrypt = require("bcryptjs")

const { catchAsync, AppError, sendResponse } = require("../helpers/utils.helper")
const Lead = require("../model/Lead")
const { createLeadPD } = require("../helpers/pipedrive.helper")

const leadController = {}

leadController.register = catchAsync(async (req, res, next) => {
    let { email, password, name, job } = req.body

    let lead = await Lead.findOne({ email });
    if (lead) throw new AppError(409, "User already exists", "Register Error");

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    lead = await Lead.create({
        name,
        email,
        password,
        job
    });
    const accessToken = await lead.generateToken();
    // createLeadPD({ name, email, job })

    return sendResponse(
        res,
        200,
        true,
        { lead, accessToken },
        null,
        "Create lead successful"
    );

})

leadController.getCurrentLead = catchAsync(async (req, res, next) => {
    const leadId = req.leadId;

    const lead = await Lead.findById(leadId);
    if (!lead)
        throw new AppError(400, "Lead not found", "Get Current Lead Error");

    return sendResponse(
        res,
        200,
        true,
        lead,
        null,
        "Get current lead successful"
    );
});


module.exports = leadController
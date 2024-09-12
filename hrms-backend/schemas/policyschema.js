var POLICYSCHEMA = {
    policyName: { type: String, required: true },
    policyDescription: { type: String, required: true },
    policyCategory: { type: String, required: true },
    effectiveDate: { type: Date, required: true },
    expirationDate: { type: Date },
    policyDocument: { type: String },
    policyOwner: { type: String, required: true },
    policyApprover: { type: String, required: true },
    versionNumber: { type: Number, required: true, default: 1 },
    status: Boolean,
    comments: { type: String },
    isDeleted: { type: Boolean, default: false }
}

module.exports = POLICYSCHEMA;

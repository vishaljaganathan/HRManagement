const mongoose = require('mongoose');
// importing schemas to create model
const importedSchema = require('../schemas/faqschema');
const importedDepartmentSchema = require('../schemas/departmentschema');
const importedDocumentSchema = require('../schemas/documentschema');
const importedPolicySchema = require('../schemas/policyschema');
const importedEmployeeSchema = require('../schemas/employeeschema');
// Creating schema
const FaqSchema = mongoose.Schema(importedSchema , { timestamps: true, versionKey: false });
const DepartmentSchema = mongoose.Schema(importedDepartmentSchema , { timestamps: true, versionKey: false });
const DocumentSchema = mongoose.Schema(importedDocumentSchema , { timestamps: true, versionKey: false });
const PolicySchema = mongoose.Schema(importedPolicySchema , { timestamps: true, versionKey: false });
const EmployeeSchema = mongoose.Schema(importedEmployeeSchema , { timestamps: true, versionKey: false });
// Creating models
const FaqModel = mongoose.model('faqs',FaqSchema);
const DepartmentModel = mongoose.model('departments',DepartmentSchema);
const DocumentModel = mongoose.model('documents',DocumentSchema);
const PolicyModel = mongoose.model('policies',PolicySchema);
const EmployeeModel = mongoose.model('emploies',EmployeeSchema);

module.exports = {
  faqs : FaqModel,
  departments : DepartmentModel,
  documents : DocumentModel,
  policies : PolicyModel,
  emploies : EmployeeModel
} 

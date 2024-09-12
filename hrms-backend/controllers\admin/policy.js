const express = require('express');
const Router = express.Router();
const DB = require('../../models/db'); // Adjust as needed
const db = require('../../models/schemaconnection'); // Adjust as needed
const HELPERFUNC = require('../../models/commonfunctions'); // Adjust as needed

const project = {
    createdAt: 0,
    updatedAt: 0,
};

// Add a new policy
Router.post('/addPolicy', async function (req, res) {
    const formData = {
        policyName: HELPERFUNC.Capitalize(req.body.policyName),
        policyDescription: HELPERFUNC.Capitalize(req.body.policyDescription),
        policyCategory: req.body.policyCategory,
        effectiveDate: req.body.effectiveDate,
        expirationDate: req.body.expirationDate ,
        policyDocument: req.body.policyDocument,
        policyOwner: req.body.policyOwner,
        policyApprover: req.body.policyApprover,
        versionNumber: req.body.versionNumber || 1,
        comments: req.body.comments,
        status: req.body.status ? req.body.status : 1,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : 0
    };

    console.log('Form Data:', formData); // Debug log

    DB.InsertDocument('policies', formData, function (err, result) {
        if (err) {
            console.error('Insert Document Error:', err); // Debug log
            res.status(400).end();
        } else {
            res.statusMessage = "Policy created successfully";
            return res.status(201).json(result);
        }
    });
});


// List all policies
Router.get('/listPolicies', function (req, res) {
    let query = {};
    query = { isDeleted: false };
    
    DB.GetDocument('policies', query, project, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            console.error('Error fetching policies:', err); // Debug log
            res.status(500).json({ message: 'Failed to fetch policies', error: err.message });
        } else {
            res.status(200).json(result);
        }
    });
});
// View a single policy by ID
Router.get('/viewPolicy/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('policies', { _id: req.params.id }, project, {});
        res.status(200).json(result);
    } catch (error) {
        res.status(400).end();
    }
});

// Update a policy by ID
Router.post('/updatePolicy/:id', async function (req, res) {
    const formData = {
        policyName: HELPERFUNC.Capitalize(req.body.policyName),
        policyDescription: HELPERFUNC.Capitalize(req.body.policyDescription),
        policyCategory: req.body.policyCategory,
        effectiveDate: req.body.effectiveDate,
        expirationDate: req.body.expirationDate,
        policyDocument: req.body.policyDocument,
        policyOwner: req.body.policyOwner,
        policyApprover: req.body.policyApprover,
        versionNumber: req.body.versionNumber,
        comments: req.body.comments,
        status: req.body.status ? req.body.status : 1,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : 0
    };

    const result = await DB.FindUpdateDocument('policies', { _id: req.params.id }, formData);

    if (result) {
        res.statusMessage = "Policy updated successfully";
        return res.status(200).json(result);
    } else {
        res.status(400).end();
    }
});

// Soft delete a policy by ID
Router.get('/softDeletePolicy/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('policies', { _id: req.params.id }, {}, {});
        if (result) {
            const result1 = await DB.FindUpdateDocument('policies', { _id: req.params.id }, { isDeleted: result.isDeleted ? !result.isDeleted : true });
            if (result1) {
                res.statusMessage = "Policy soft deleted successfully";
                return res.status(200).json(result);
            } else {
                res.status(400).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (error) {
        throw error;
    }
});

module.exports = Router;

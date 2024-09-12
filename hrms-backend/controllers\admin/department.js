const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const db = require('../../models/schemaconnection')
const HELPERFUNC = require('../../models/commonfunctions');

const project = {
    createdAt: 0,
    updatedAt: 0,
}
Router.post('/addDepartment', async function (req, res) {
    const formData = {
        name: HELPERFUNC.Capitalize(req.body.name),
        description: HELPERFUNC.Capitalize(req.body.description),
        status: req.body.status ? req.body.status : 1,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : 0
    }

    DB.InsertDocument('departments', formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Department created successfully";
            return res.status(201).json(result);
        }
    })
});
Router.get('/listDepartment', function (req, res) {
    let query = {};
    query = { isDeleted: false }
    DB.GetDocument('departments', query, project, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(201).json(result);
        }
    });
});
Router.post('/viewDepartment/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('departments', { _id: req.params.id }, project, {});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).end();
    }
});
Router.post('/updateDepartment/:id', async function (req, res) {
    const formData = {
        name: HELPERFUNC.Capitalize(req.body.name),
        description: HELPERFUNC.Capitalize(req.body.description),
        status: req.body.status,
        isDeleted: req.body.isDeleted
    }

    const result = await db.departments.findOne({ name: formData.name });
    const result1 = await DB.FindUpdateDocument('departments', { _id: req.params.id }, formData);

    if (result1) {
        res.statusMessage = "Department updated successfully";
        return res.status(200).json(result);
    } else {
        res.status(400).end();
    }
});

Router.get('/softDeleteDepartment/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('departments', { _id: req.params.id }, {}, {});
        if (result) {
            const result1 = await DB.FindUpdateDocument('departments', { _id: req.params.id }, { isDeleted: result.isDeleted ? !result.isDeleted : 1 });
            if (result1) {
                res.statusMessage = "Department deleted successfully";
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

const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const db = require('../../models/schemaconnection')
const HELPERFUNC = require('../../models/commonfunctions');

const project = {
    createdAt: 0,
    updatedAt: 0,
}
Router.post('/addFaq', async function (req, res) {
    const formData = {
        question: HELPERFUNC.Capitalize(req.body.question),
        answare: HELPERFUNC.Capitalize(req.body.answare),
        status: req.body.status ? req.body.status : 1,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : 0
    }

    const result = await db.faqs.findOne({ question: formData.question });
    if (result) {
        res.statusMessage = "Faq already exist";
        return res.status(409).end();
    }
    DB.InsertDocument('faqs', formData, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            res.statusMessage = "Faq created successfully";
            return res.status(201).json(result);
        }
    })
});
Router.get('/listFaq', function (req, res) {
    let query = {};
    query = { isDeleted: false }
    DB.GetDocument('faqs', query, project, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(201).json(result);
        }
    })
});
Router.post('/viewFaq/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('faqs', { _id: req.params.id }, project, {});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).end();
    }
});
Router.post('/updateFaq/:id', async function (req, res) {
    const formData = {
        question: HELPERFUNC.Capitalize(req.body.question),
        answare: HELPERFUNC.Capitalize(req.body.answare),
        status: req.body.status,
        isDeleted: req.body.isDeleted
    }

    const result = await db.faqs.findOne({ question: formData.question });
    if (result) {
        res.statusMessage = "Faq already exist";
        return res.status(409).end();
    }
    const result1 = await DB.FindUpdateDocument('faqs', { _id: req.params.id }, formData);

    if (result1) {
        res.statusMessage = "Faq updated successfully";
        return res.status(200).json(result);
    } else {
        res.status(400).end();
    }
});

Router.get('/softDeleteFaq/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('faqs', { _id: req.params.id }, {}, {});
        if (result) {
            const result1 = await DB.FindUpdateDocument('faqs', { _id: req.params.id }, { isDeleted: result.isDeleted ? !result.isDeleted : 1 });
            if (result1) {
                res.statusMessage = "Faq deleted successfully";
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

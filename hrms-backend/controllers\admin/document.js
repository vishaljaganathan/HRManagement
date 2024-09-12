const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const db = require('../../models/schemaconnection');

const project = {
    createdAt: 0,
    updatedAt: 0,
};

Router.post('/addDocument', async function (req, res) {
    const formData = {
        documentName: req.body.documentName,
        isDeleted: req.body.isDeleted ? req.body.isDeleted : 0
    };


    try {
        const result = await db.document.findOne({ documentName: formData.documentName });
        if (result) {
            res.statusMessage = "Document name already exists";
            return res.status(409).end();
        }

        DB.InsertDocument('document', formData, function (err, result) {
            if (err) {
                res.status(400).end();
            } else {
                res.statusMessage = "Document created successfully";
                return res.status(201).json(result);
            }
        });
    } catch (error) {
        console.error('Error while creating document:', error);
        res.status(500).end();
    }
});

Router.get('/listdocument', function (req, res) {
    let query = {};
    query = { isDeleted: false };
    DB.GetDocument('document', query, project, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(201).json(result);
        }
    });
});

Router.post('/viewDocument/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('document', { _id: req.params.id }, project, {});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).end();
    }
});

Router.post('/updateDocument/:id', async function (req, res) {
    const formData = {
        documentName: req.body.documentName,
        isDeleted: req.body.isDeleted
    };

    try {
        const result = await DB.FindUpdateDocument('document', { _id: req.params.id }, formData);
        if (result) {
            res.statusMessage = "Document updated successfully";
            return res.status(200).json(result);
        } else {
            res.status(400).end();
        }
    } catch (error) {
        res.status(500).end();
    }
});

Router.get('/softDeleteDocument/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('document', { _id: req.params.id }, {}, {});
        if (result) {
            const updatedResult = await DB.FindUpdateDocument('document', { _id: req.params.id }, { isDeleted: result.isDeleted ? !result.isDeleted : 1 });
            if (updatedResult) {
                res.statusMessage = "document deleted successfully";
                return res.status(200).json(result);
            } else {
                res.statusMessage = "issue while deleting document";
                res.status(400).end();
            }
        } else {
            res.statusMessage = "issue while finding document";
            res.status(400).end();
        }
    } catch (error) {
        res.statusMessage = "issue with the  deletion  request";
        res.status(500).end();
    }
});

module.exports = Router;

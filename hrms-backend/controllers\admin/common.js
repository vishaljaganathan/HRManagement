const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const db = require('../../models/schemaconnection')
const HELPERFUNC = require('../../models/commonfunctions');

Router.get('/statusChange/:id/:model', async function (req, res) {
    try {
        const result = await DB.GetOneDocument(req.params.model, { _id: req.params.id }, {}, {});
        if (result) {
            const result1 = await DB.FindUpdateDocument(req.params.model, { _id: req.params.id }, { status: result.status ? !result.status : 1 });
            if (result1) {
                res.statusMessage = "Status updated successfully";
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

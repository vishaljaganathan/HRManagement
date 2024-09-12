const express = require('express');
const Router = express.Router();
const DB = require('../../models/db');
const db = require('../../models/schemaconnection');
const HELPERFUNC = require('../../models/commonfunctions');
const nodemailer = require('nodemailer');


const project = {
    createdAt: 0,
    updatedAt: 0,
};

// Configure your email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service provider
    auth: {
        user: 'nearbyworkers@gmail.com', // your email
        pass: '9488778490'  // your email password or app-specific password
    }
});


// Route to add a new employee
Router.post('/addEmployee', async function (req, res) {
    const formData = {
        firstName: HELPERFUNC.Capitalize(req.body.firstName),
        lastName: HELPERFUNC.Capitalize(req.body.lastName),
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        position: req.body.position,
        hireDate: req.body.hireDate ? req.body.hireDate : new Date(),
        salary: req.body.salary,
        status: req.body.status ? req.body.status : 'Active',
        isDeleted: req.body.isDeleted ? req.body.isDeleted : false
    };

    const result = await db.employees.findOne({ email: formData.email });
    if (result) {
        res.statusMessage = "Employee already exists";
        return res.status(409).end();
    }

    DB.InsertDocument('employees', formData, async function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            // Email options
            const mailOptions = {
                from: 'nearbyworkers@gmail.com',
                to: formData.email, // recipient email
                subject: 'Welcome to the Company!',
                text: `Dear ${formData.firstName},\n\nWelcome to the company! We're excited to have you on board as our new ${formData.position}. If you have any questions, feel free to reach out.\n\nBest regards,\nYour Company Name`
            };

            // Send the email
            try {
                await transporter.sendMail(mailOptions);
                res.statusMessage = "Employee created and email sent successfully";
                return res.status(201).json(result);
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                res.statusMessage = "Employee created, but failed to send email";
                return res.status(201).json(result);
            }
        }
    });
});

// Route to list all employees
Router.get('/listEmployee', function (req, res) {
    let query = { isDeleted: false };
    DB.GetDocument('employees', query, project, { sort: { createdAt: -1 } }, function (err, result) {
        if (err) {
            res.status(400).end();
        } else {
            return res.status(201).json(result);
        }
    });
});

// Route to view a single employee by ID
Router.post('/viewEmployee/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('employees', { _id: req.params.id }, project, {});
        res.status(201).json(result);
    } catch (error) {
        res.status(400).end();
    }
});

// Route to update an employee's details by ID
Router.post('/updateEmployee/:id', async function (req, res) {
    const formData = {
        firstName: HELPERFUNC.Capitalize(req.body.firstName),
        lastName: HELPERFUNC.Capitalize(req.body.lastName),
        email: req.body.email.toLowerCase(),
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        position: req.body.position,
        hireDate: req.body.hireDate,
        salary: req.body.salary,
        status: req.body.status,
        isDeleted: req.body.isDeleted
    };

    const result = await db.employees.findOne({ email: formData.email, _id: { $ne: req.params.id } });
    if (result) {
        res.statusMessage = "Employee with this email already exists";
        return res.status(409).end();
    }

    const result1 = await DB.FindUpdateDocument('employees', { _id: req.params.id }, formData);
    if (result1) {
        res.statusMessage = "Employee updated successfully";
        return res.status(200).json(result1);
    } else {
        res.status(400).end();
    }
});

// Route to soft delete an employee by ID
Router.get('/softDeleteEmployee/:id', async function (req, res) {
    try {
        const result = await DB.GetOneDocument('employees', { _id: req.params.id }, {}, {});
        if (result) {
            const result1 = await DB.FindUpdateDocument('employees', { _id: req.params.id }, { isDeleted: !result.isDeleted });
            if (result1) {
                res.statusMessage = "Employee deleted successfully";
                return res.status(200).json(result1);
            } else {
                res.status(400).end();
            }
        } else {
            res.status(400).end();
        }
    } catch (error) {
        res.status(400).end();
    }
});

module.exports = Router;

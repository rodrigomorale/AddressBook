/*********************************************************************
* Module name..: index.js
* Author.......: Rodrigo Canella Garcia Morale
* Description..: Main module from addressBook API application
* Creation date: July 7, 2021
* VRS..........: 1.0
*********************************************************************/

// ADD MODULES
const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const app = express();

// CONFIG ENVIRONMENT
dotenv.config();
const contactService = require("./addressBook-service.js");
const HTTP_PORT = process.env.PORT || 8080;

// ADD JSON
app.use(express.json());


// GENERIC ROUTE: DESCRIBE API FUNCTIONS
app.get("/", (req, res) => { 
    res.send(`
    <h1>Address Book API:</h1>
    <h2>List of functionalities:</h2>
    <h4>/api/newContact: Add new contact information</h4>
    <h4>/api/getContact: Get a single contact information</h4>
    <h4>/api/getAllContacts: Get a list of all contacts information</h4>
    <h4>/api/deleteContact: Delete a single contact information</h4>
    <h4>/api/updateContact: Update a single contact information</h4>
    `);
});

// ROUTE TO ADD NEW CONTACT
app.post("/api/newContact", (req, res) => {
    contactService.newContact(req.body)
        .then((msg) => {
            res.json({ "message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

// ROUTE TO GET ONE SINGLE CONTACT
app.get("/api/getContact", (req, res) => { 
    contactService.getContact(req.body)
        .then((contact) => {
            res.json(contact);
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

// ROUTE TO GET ALL CONTACTS
app.get("/api/getAllContacts", (req, res) => { 
    contactService.getAllContacts()
        .then((msg) => {
            res.json(msg);
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

// ROUTE TO DELETE ONE SINGLE CONTACT
app.delete("/api/deleteContact", (req, res) => { 
    contactService.deleteContact(req.body)
        .then((msg) => {
            res.json({ "message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

// ROUTE TO GET ONE SINGLE CONTACT
app.put("/api/updateContact", (req, res) => { 
    contactService.updateContact(req.body)
        .then((msg) => {
            res.json({" message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

// STABILISH CONNECTION
contactService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});
const express = require('express');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const app = express();

dotenv.config();
const contactService = require("./addressBook-service.js");
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());


/* GENERIC ROUTE */
app.get("/", (req, res) => { 
    res.send(`
    <h1>Address Book API:</h1>
    <h2>List of functionalities:</h2>
    <h4>/api/newContact: Add new contact</h4>
    <h4>/api/getContact</h4>
    <h4>/api/getAllContacts</h4>
    <h4>/api/deleteContact</h4>
    <h4>/api/updateContact</h4>
    `);
});

/* ROUTE TO ADD NEW CONTACT */
app.post("/api/newContact", (req, res) => {
    contactService.newContact(req.body)
        .then((msg) => {
            res.json({ "message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

/* ROUTE TO GET ONE CONTACT */
app.get("/api/getContact", (req, res) => { 
    contactService.getContact(req.body)
        .then((contact) => {
            res.json(contact);
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

/* ROUTE TO GET ALL CONTACTS */
app.get("/api/getAllContacts", (req, res) => { 
    contactService.getAllContacts()
        .then((msg) => {
            res.json(msg);
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

/* ROUTE TO DELETE CONTACT */
app.delete("/api/deleteContact", (req, res) => { 
    contactService.deleteContact(req.body)
        .then((msg) => {
            res.json({ "message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

/* ROUTE TO GET ONE CONTACT */
app.put("/api/updateContact", (req, res) => { 
    contactService.updateContact(req.body)
        .then((msg) => {
            res.json({" message": msg });
        }).catch((msg) => {
            res.status(422).json({ "message": msg });
        });
});

contactService.connect()
.then(() => {
    app.listen(HTTP_PORT, () => { console.log("API listening on: " + HTTP_PORT) });
})
.catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
});
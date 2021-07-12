/*********************************************************************
* Module name..: AddressBook-service.js
* Author.......: Rodrigo Canella Garcia Morale
* Description..: Handle CRUD function for Contacts database (MongoDB)
* Creation date: July 7, 2021
* VRS..........: 1.0
*********************************************************************/

// DATABASE VARIABLES
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#findandmodify

let mongoDBConnectionString = process.env.MONGO_URL;
let Schema = mongoose.Schema;
let Contacts; // -> CONNECTION VARIABLE

// COLLECTION SCHEME
let contactSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    image: {
        data: Buffer,
        contentType: String
    }
});

// DATABASE CONNECTION CREATION
module.exports.connect = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});

        db.on('error', err => {
            reject(err);
        });

        db.once('open', () => {
            Contacts = db.model("Contacts", contactSchema);
            resolve();
        });
    });
};

// ADD NEW CONTACT FUNCTION
module.exports.newContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.insertOne({ 
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
            image: contactData.image 
        })
        .exec()
        .then(msg => {
            resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} added with success.`);
        }).catch(err => {
            reject(`Unable to add new contact information of ${contactData.firstName} ${contactData.lastName}`);
        });
    });
};

// GET SINGLE CONTACT FUNCTION
module.exports.getContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.findOne({ _id: contactData._id })
            .exec()
            .then(contact => {
                resolve(contact);
            }).catch(err => {
                reject(`Unable to find contact information of ${contactData.firstName} ${contactData.lastName}`);
            });
    });
};

// GET ALL CONTACT FUNCTION
module.exports.getAllContacts = function () {
    return new Promise(function (resolve, reject) {

        Contacts.find({})
            .exec()
            .then(contacts => {
                resolve(contacts);
            }).catch(err => {
                reject("Unable to find ny contact in database!");
            });
    });
};

// DELETE A SINGLE CONTACT FUNCTION
module.exports.deleteContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.deleteOne({ _id: contactData._id },{ writeConcern: 'majority' })
            .exec()
            .then(message => {
                resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} delete from the database.`);
            }).catch(err => {
                reject(`Unable to delete contact information of ${contactData.firstName} ${contactData.lastName}`);
            });
    });
};

// UPDATE A SINGLE CONTACT FUNCTION
module.exports.updateContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.updateOne({ _id: contactData._id },
             {$set: {
                 firstName: contactData.firstName,
                 lastName: contactData.lastName,
                 email: contactData.email,
                 phone: contactData.phone,
                 image: contactData.image
            }}, { writeConcern: 'majority' })
            .exec()
            .then(msg => {
                resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} updated at database.`);
            }).catch(err => {
                console.log(err)
                reject(`Unable to update contact information of ${contactData.firstName} ${contactData.lastName}`);
            });
    });
};
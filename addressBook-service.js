const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false); //https://mongoosejs.com/docs/deprecations.html#findandmodify

let mongoDBConnectionString = process.env.MONGO_URL;

let Schema = mongoose.Schema;

let contactSchema = new Schema({
    id: {
        type: String,
        unique: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    firstName: String,
    lastName: String,
    email: String,
    phone: String
});

let Contacts;

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

module.exports.newContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.insertOne({ 
            id: contactData.id, 
            image: contactData.image, 
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone
        })
        .exec()
        .then(msg => {
            resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} added with success.`);
        }).catch(err => {
            reject(`Unable to add new contact information of ${contactData.firstName} ${contactData.lastName}`);
        });
    });
};

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


module.exports.deleteContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.remove({ _id: contactData._id })
            .exec()
            .then(message => {
                resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} delete from the database.`);
            }).catch(err => {
                reject(`Unable to delete contact information of ${contactData.firstName} ${contactData.lastName}`);
            });
    });
};

module.exports.updateContact = function (contactData) {
    return new Promise(function (resolve, reject) {

        Contacts.updateOne({ _id: contactData._id },
            { $set: {
                /* image: contactData.image, */ 
                firstName: contactData.firstName,
                lastName: contactData.lastName,
                email: contactData.email,
                phone: contactData.phone
            }})
            .exec()
            .then(msg => {
                resolve(`Contact information of ${contactData.firstName} ${contactData.lastName} updated at database.`);
            }).catch(err => {
                console.log(err)
                reject(`Unable to update contact information of ${contactData.firstName} ${contactData.lastName}`);
            });
    });
};
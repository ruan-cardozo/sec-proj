const mongoose = require('mongoose');

const signedDocumentSchema = new mongoose.Schema({
    documentId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        required: true
    },
    pdfBytes: {
        type: [Number],
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    signature: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now
    },
    publicKey: {
        type: String,
        required: true
    }
});

const SignedDocument = mongoose.model('SignedDocument', signedDocumentSchema);

module.exports = SignedDocument;
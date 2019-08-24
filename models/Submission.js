const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionModel =  mongoose.model('submission',new Schema ({
    email: {
        type: String,
        required: true
    },
    story: {
        type: String
    },
    submission: {
        type: Object
    }
}, {collection: 'submission'}));

module.exports = SubmissionModel;
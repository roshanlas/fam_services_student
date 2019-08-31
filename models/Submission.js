const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StoryModel =  mongoose.model('submission',new Schema ({
    email: {
        type: String,
        required: true
    },
    storyID: {
        type: String
    },
    submission: {
        type: Object
    },
    final: {
        type: Boolean
    }
}, {collection: 'submission'}));

module.exports = StoryModel;
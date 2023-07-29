const mongoose = require('mongoose');

const userGroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    groups: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

const UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;
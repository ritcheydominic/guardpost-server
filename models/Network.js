const mongoose = require('mongoose');

const networkSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    cidr4: {
        type: String,
        required: false,
        index: true
    },
    cidr6: {
        type: String,
        required: false,
        index: true
    },
    interfaces: {
        type: [mongoose.Schema.Types.ObjectId],
        default: []
    }
});

const Network = mongoose.model('Network', networkSchema);

module.exports = Network;
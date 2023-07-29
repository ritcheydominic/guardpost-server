const mongoose = require('mongoose');

const interfaceSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    network: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    managementMethod: {
        type: Number,
        default: 0
            /* 0: Disabled
             * 1: SSH
             * 2: EdgeOS
             */
    },
    managementInterface: {
        type: String,
        required: false
    },
    managementSshHost: {
        type: String,
        required: false
    }
});

const Interface = mongoose.model('Interface', interfaceSchema);

module.exports = Interface;
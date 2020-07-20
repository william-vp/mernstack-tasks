const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
    }
});
module.exports = mongoose.model('Task', taskSchema);
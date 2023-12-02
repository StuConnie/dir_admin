const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = () => {
    
    let schema_column = new Schema({
        email: { type: String, required: true },
        rate: { type: Number, required: true },
        id_document: { type: String, required: true }
    }, { timestamps: true });

    if(mongoose.models['rate_documents']) return mongoose.models['rate_documents']

    return mongoose.model('rate_documents', schema_column);
}
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = () => {
    let schema_column = null;

    schema_column = new Schema({
        title: { type: String, required: true },
        id_document: { type: String, required: true }
    }, { timestamps: true });

    if(mongoose.models['search_documents']) return mongoose.models['search_documents'];

    return mongoose.model('search_documents', schema_column);
}
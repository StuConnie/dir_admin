const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = () => {
    
    let schema_column = new Schema({
        username: { type: String, required: true },
        password: { type: String, required: true }
    }, { timestamps: true });

    if(mongoose.models['admin_account']) return mongoose.models['admin_account']

    return mongoose.model('admin_account', schema_column);
}


const mongoose = require("mongoose")

const database = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/dir_admin",
            { useNewUrlParser: true, useUnifiedTopology: true });
    }catch(err){
        console.error(err);
    }
}

module.exports = database
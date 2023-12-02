const User = require("./models/users.js");
const connectDB =  require("./config/db.js")

const ImportUser = async () => {
    try {
        await connectDB();
        await User.deleteMany({});

        await User.insertMany([
            {
                username: "Jane doe",
                email: "VMSC@gmail.com",
                password: "@VMSC1234",
                track: "STEM",
                isStudent: true
            },

        ]);

        console.log("UserData Imported");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

if (process.argv[2] === "-d") {
    destroyData();
} else {
    ImportUser();
}
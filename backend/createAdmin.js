
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");
require("dotenv").config();

const Admin = require("./Admin");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        rl.question("Enter admin username: ", (username) => {
            rl.question("Enter admin password: ", async (password) => {
                try {
                    if (!username.trim() || password.length < 8) {
                        console.log("Username is required and password must be at least 8 characters.");
                        return;
                    }

                    const existingAdmin = await Admin.findOne({
                        username: username.trim()
                    });

                    if (existingAdmin) {
                        console.log("This admin already exists.");
                        return;
                    }

                    const hashedPassword = await bcrypt.hash(password, 12);

                    await Admin.create({
                        username: username.trim(),
                        password: hashedPassword
                    });

                    console.log("Admin account created successfully!");

                } catch (error) {
                    console.error("Error:", error.message);
                } finally {
                    rl.close();
                    await mongoose.disconnect();
                }
            });
        });

    } catch (error) {
        console.error("Database connection error:", error.message);
        rl.close();
    }
}

createAdmin();

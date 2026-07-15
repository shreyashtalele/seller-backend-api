require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const Admin = require("../models/Admin");

const seedAdmin = async () => {
    try {
        const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

        if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be defined in the .env file"
            );
        }

        await connectDB();

        const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();

        const existingAdmin = await Admin.findOne({
            email: normalizedEmail,
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const saltRounds = 12;

        const hashedPassword = await bcrypt.hash(
            ADMIN_PASSWORD,
            saltRounds
        );

        await Admin.create({
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Initial admin created successfully");
    } catch (error) {
        console.error(`Admin seeding failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedAdmin();
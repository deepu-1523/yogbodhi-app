import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./modules/Student/student.model.js";

dotenv.config();

const seedAdminAndTeacher = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        // Define the admin and teacher data
        const usersToSeed = [
            {
                fullName: "Admin User",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin",
            },
            {
                fullName: "Teacher User",
                email: "teacher@gmail.com",
                password: hashedPassword,
                role: "instructor",
            }
        ];

        for (const userData of usersToSeed) {
            // Check if a user with this email already exists
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                // Update their password and role to ensure they are correct
                existingUser.password = hashedPassword;
                existingUser.role = userData.role;
                await existingUser.save();
                console.log(`Updated existing user: ${userData.fullName} | Email: ${userData.email} | Role: ${userData.role}`);
            } else {
                // Create a new user
                const newUser = new User(userData);
                await newUser.save();
                console.log(`Created new user: ${userData.fullName} | Email: ${userData.email} | Role: ${userData.role}`);
            }
        }

        console.log(`Successfully seeded Admin and Teacher accounts.`);
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin and teacher:", error);
        process.exit(1);
    }
};

seedAdminAndTeacher();

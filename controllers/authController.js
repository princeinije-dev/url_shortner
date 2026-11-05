import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const checkUser = await pool.query(
            "SELECT user_id FROM users WHERE username = $1 OR email = $2",
            [username, email]
        );

        if (checkUser.rows.length > 0) {
            return res.status(409).json({
                message: "Username or email already exists"
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const insertQuery = `
            INSERT INTO users (username, email, password)
            VALUES ($1, $2, $3)
            RETURNING user_id, username, email, created_at;
        `;

        const newUser = await pool.query(insertQuery, [
            username,
            email,
            hashedPassword
        ]);

        res.status(201).json({
            message: "User created successfully",
            user: newUser.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Internal server error"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(            
            "SELECT * FROM users WHERE email = $1",
      [email]
        );
        if(result.rows.length === 0) {
            return res.status(404).json({ message: "User not found",});
        }
        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({message: "Invalid email or password"});
        }
        const token = jwt.sign(
            { id: user.user_id, email: user.email}, process.env.JWT_SECRET, {expiresIn: "1d" });

            res.status(200).json({message: "Login successful", token,})
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({  message: "Server error", });
    }
};

export { registerUser, loginUser };
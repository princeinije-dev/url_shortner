import { Pool } from "pg";
import "dotenv/config"

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function connectDB() {
    try {
        const test = await pool.connect();
        console.log("Connected")
        test.release();
    } catch (error) {
        console.error("Database Error:", error.message);
        process.exit(1);
    }
}

export { pool, connectDB};
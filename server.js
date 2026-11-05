import express from 'express';
import "dotenv/config";
import { redirectUrl } from "./controllers/redirectController.js";
import urlRoutes from "./routes/urlRoutes.js";
import { connectDB } from './config/db.js';
import path from "node:path";
import viewRoutes from "./routes/viewRoutes.js";
import authRoutes from './routes/authRoutes.js';
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use("/api/urls", urlRoutes);


app.use("/", viewRoutes);

app.get("/:shortCode", redirectUrl);




async function startServer() {
try {
    await connectDB();
const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`server running on port ${PORT}`)
    }); } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
} 

startServer();
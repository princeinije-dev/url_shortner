
import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", { title: "Linkly - Shorten your links" });
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Login - Linkly" });
});

router.get("/register", (req, res) => {
    res.render("register", { title: "Create account - Linkly" });
});

router.get("/dashboard", (req, res) => {
    res.render("dashboard", { title: "Dashboard - Linkly" });
});

export default router;

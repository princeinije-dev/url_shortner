import { findUrlByShortCode, incrementClickCount } from "../models/urlModel.js";

const redirectUrl = async (req, res) => {
    try {
        const { shortCode } = req.params;
        const url = await findUrlByShortCode(shortCode);
        if (!url) {
            return res.status(404).json({ message: "Short URL not found" })
        }
        await incrementClickCount(shortCode);
        return res.redirect(url.original_url);
    } catch (error) {
        console.log("Redirect error:", error)
        res.status(500).json({message: "Server error"});
    }
};

export { redirectUrl };
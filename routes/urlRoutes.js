
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    createUrl,
    getAllUrls,
    getUrlById,
    updateUrl,
    deleteUrl
} from "../controllers/urlController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createUrl);
router.get("/", getAllUrls);
router.get("/:id", getUrlById);
router.put("/:id", updateUrl);
router.delete("/:id", deleteUrl);

export default router;

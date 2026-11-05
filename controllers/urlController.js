
import {
    createShortUrl,
    getAllUrls as getAllUserUrls,
    getUrlById as getUserUrlById,
    updateUrl as updateUserUrl,
    deleteUrl as deleteUserUrl
} from "../models/urlModel.js";

import { randomBytes } from "node:crypto";

const createUrl = async (req, res) => {
    try {
        const { originalUrl } = req.body;
        const userId = req.user.id;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        const shortCode = randomBytes(4).toString("hex");
        const newUrl = await createShortUrl(userId, originalUrl, shortCode);

        res.status(201).json({
            message: "Short URL created successfully",
            url: newUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getAllUrls = async (req, res) => {
    try {
        const userId = req.user.id;
        const urls = await getAllUserUrls(userId);

        res.status(200).json({ urls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const getUrlById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const url = await getUserUrlById(id, userId);

        if (!url) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { originalUrl } = req.body;
        const userId = req.user.id;

        if (!originalUrl) {
            return res.status(400).json({
                message: "Original URL is required"
            });
        }

        const updatedUrl = await updateUserUrl(id, userId, originalUrl);

        if (!updatedUrl) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.status(200).json({
            message: "URL updated successfully",
            url: updatedUrl
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const deletedUrl = await deleteUserUrl(id, userId);

        if (!deletedUrl) {
            return res.status(404).json({
                message: "URL not found"
            });
        }

        res.status(200).json({
            message: "URL deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export {
    createUrl,
    getAllUrls,
    getUrlById,
    updateUrl,
    deleteUrl
};

import { pool } from "../config/db.js";

export const createShortUrl = async (userId, originalUrl, shortCode) => {
    const result = await pool.query(
        `INSERT INTO urls (user_id, original_url, short_code)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [userId, originalUrl, shortCode]
    );

    return result.rows[0];
};

export const getAllUrls = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM urls WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );

    return result.rows;
};


export const getUrlById = async (urlId, userId) => {
    const result = await pool.query(
        "SELECT * FROM urls WHERE url_id = $1 AND user_id = $2",
        [urlId, userId]
    );

    return result.rows[0];
};


export const updateUrl = async (urlId, userId, originalUrl) => {
    const result = await pool.query(
        `UPDATE urls
         SET original_url = $1
         WHERE url_id = $2 AND user_id = $3
         RETURNING *`,
        [originalUrl, urlId, userId]
    );

    return result.rows[0];
};


export const deleteUrl = async (urlId, userId) => {
    const result = await pool.query(
        "DELETE FROM urls WHERE url_id = $1 AND user_id = $2 RETURNING *",
        [urlId, userId]
    );

    return result.rows[0];
};

export const findUrlByShortCode = async (shortCode) => {
    const result = await pool.query(
        "SELECT * FROM urls WHERE short_code = $1",
        [shortCode]
    );

    return result.rows[0];
};


export const incrementClickCount = async (shortCode) => {
    const result = await pool.query(
        `UPDATE urls
         SET clicks = clicks + 1
         WHERE short_code = $1
         RETURNING *`,
        [shortCode]
    );

    return result.rows[0];
};
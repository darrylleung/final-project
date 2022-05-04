const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/redacted`
);

exports.registerNewUser = (username, email, hashedPassword) => {
    return db.query(
        `INSERT INTO users
        (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id`,
        [username, email, hashedPassword]
    );
};

exports.login = (email) => {
    return db.query(
        `SELECT password, id
        FROM users
        WHERE email = $1`,
        [email]
    );
};

exports.retrieveLeaderboard = () => {
    return db.query(
        `SELECT username, puzzle_id, score
        FROM leaderboard
        ORDER BY score ASC
        LIMIT 5
        `
    );
};

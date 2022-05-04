CREATE TABLE archive (
    id SERIAL PRIMARY KEY,
    lead_paragraph VARCHAR NOT NULL,
    headline VARCHAR NOT NULL,
    byline VARCHAR NOT NULL,
    pub_date TIMESTAMP,
    news_desk VARCHAR,
    section VARCHAR,
    url VARCHAR NOT NULL UNIQUE
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE CHECK (username <> ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR NOT NULL CHECK (password <> '$2a$10$HMlgxlXsW4XS3yC/KBbBmeB3UrfBMJu3X1dwbL98BtUKZRbfuoWg.'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leaderboard(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE CHECK (username <> ''),
    puzzle_id INTEGER NOT NULL,
    score INTEGER NOT NULL
)


DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS leaderboard;
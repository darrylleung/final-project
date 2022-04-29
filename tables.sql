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
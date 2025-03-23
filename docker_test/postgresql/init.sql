DROP TABLE IF EXISTS shortened_url CASCADE;
DROP TABLE IF EXISTS blocked_domain CASCADE;

CREATE TABLE shortened_url
(
    id            bigint GENERATED ALWAYS AS IDENTITY,
    origin_url    varchar(255)          NOT NULL,
    shortened_url varchar(100)          NOT NULL,
    expired_at    timestamptz,
    disabled      BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE blocked_domain
(
    id     bigint GENERATED ALWAYS AS IDENTITY,
    domain varchar(255) NOT NULL
);

INSERT INTO shortened_url (origin_url, shortened_url, expired_at)
SELECT
    'https://news.ycombinator.com/item?id=' || i AS origin_url,
    'prd-' || 10000000000 || i::text AS shortened_url,
        '2300-01-01 00:00:00+00'::timestamptz
FROM generate_series(1, 100000) AS i;

CREATE INDEX idx_shortened_url_hash ON shortened_url USING HASH (shortened_url);
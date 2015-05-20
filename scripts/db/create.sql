CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    login VARCHAR UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    firstname VARCHAR(64),
    lastname VARCHAR(64),
    created TIMESTAMP DEFAULT NOW()
);

CREATE TABLE timelines (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    title VARCHAR(64) NOT NULL,
    created TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    timeline_id INTEGER REFERENCES timelines (id),
    title VARCHAR(64) NOT NULL,
    type VARCHAR(30) NOT NULL,
    date TIMESTAMP NOT NULL,
    description text
);

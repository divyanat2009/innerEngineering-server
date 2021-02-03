CREATE TABLE ie_users(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    fullname TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT,
    date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);
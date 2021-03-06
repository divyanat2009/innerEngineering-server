CREATE TABLE ie_goals(
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    emotional INTEGER CHECK (emotional > -1 AND emotional < 11),
    energy INTEGER CHECK (energy > -1 AND energy < 11),
    physical INTEGER CHECK (physical > -1 AND physical < 11),
    spiritual INTEGER CHECK (spiritual > -1 AND spiritual < 11),
    user_id INTEGER REFERENCES ie_users(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created TIMESTAMP default CURRENT_TIMESTAMP
);

CREATE TABLE user_eats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user(id) ON DELETE CASCADE,
    spoonacular_id BIGINT REFERENCES spoon_eats(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    source_url VARCHAR(500),
    summary TEXT,
    instructions TEXT,
    ingredients JSONB,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE spoon_eats (
    id BIGINT PRIMARY KEY, 
    title VARCHAR(30) NOT NULL,
    image_url VARCHAR(500),
    source_url VARCHAR(500),
    summary TEXT,
    instructions TEXT,
    ingredients JSONB,
    crated_at TIMESTAMP default CURRENT_TIMESTAMP
);

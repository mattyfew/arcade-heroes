DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    content TEXT,
    image_id INTEGER REFERENCES images(id),
    username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (image, username, title, description) VALUES ('zQUPnaCEXN0Qd-oxsEimZ6V1wtN66CyN.png', 'funkychicken', 'Sonic', 'The fastest dude alive!');
INSERT INTO images (image, username, title, description) VALUES ('hICEPEwD-c7O_7ZraeiGzxnb8XzUNRlC.png', 'mattyfew', 'Mario', 'The classic.');
INSERT INTO images (image, username, title, description) VALUES ('Ut8ugPqMS33Ywb4imiVstAEj3kfZLGWa.png', 'discoduck', 'Cloud', 'Such a badass.');

INSERT INTO comments (content, image_id, username) VALUES ('Love that guy', 3, 'mattyfew');
INSERT INTO comments (content, image_id, username) VALUES ('FFVII was my favorite', 3, 'paulie_fowlie');

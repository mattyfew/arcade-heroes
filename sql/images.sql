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

INSERT INTO images (image, username, title, description) VALUES ('zQUPnaCEXN0Qd-oxsEimZ6V1wtN66CyN.png', 'lorisborealis', 'Sonic', 'The fastest dude alive!');
INSERT INTO images (image, username, title, description) VALUES ('hICEPEwD-c7O_7ZraeiGzxnb8XzUNRlC.png', 'mattyfew', 'Mario', 'The classic.');
INSERT INTO images (image, username, title, description) VALUES ('Ut8ugPqMS33Ywb4imiVstAEj3kfZLGWa.png', 'paupaufowfow', 'Cloud', 'I miss this game so much.');
INSERT INTO images (image, username, title, description) VALUES ('5EVEadROSyQjxvdFKkEgj0O69PSq3f8L.png', 'mattyfew', 'Samus Aran', 'This character was awesome in Super Smash Bros!');
INSERT INTO images (image, username, title, description) VALUES ('9yfyYeWWKg4TiJKq09clKXwiK0HIdp4X.png', 'mattyfew', 'Crash Bandicoot', 'All we are missing is his TNT boxes.');
INSERT INTO images (image, username, title, description) VALUES ('6qGFlBkul2G9CVD-vMDEgmMaLRPxE_Ds.png', 'mattyfew', 'Link', 'The best knight of all time.');
INSERT INTO images (image, username, title, description) VALUES ('wqBmPZMLTzRtSD-B0mXvWo9Bc0xz1elv.png', 'mattyfew', 'Solid Snake', 'My favorite covert agent.');

INSERT INTO comments (content, image_id, username) VALUES ('Love that guy', 3, 'mattyfew');
INSERT INTO comments (content, image_id, username) VALUES ('FFVII was my favorite', 3, 'paulie_fowlie');

/*
Schema DDL by Kellen Swanson and Mick Forsman
Group 58 - Happy Feathers Hospital and Rehabilitation 
Project Step 4 Draft
(re)load Database 
*/

USE cs340_swanskel;
DROP PROCEDURE IF EXISTS sp_reset_hfh;

DELIMITER //
CREATE PROCEDURE sp_reset_hfh()
BEGIN
    SET FOREIGN_KEY_CHECKS = 0;
    SET AUTOCOMMIT = 0;

    -- Drop tables
    DROP TABLE IF EXISTS Feeding_Logs;
    DROP TABLE IF EXISTS Birds;
    DROP TABLE IF EXISTS Owners;
    DROP TABLE IF EXISTS Feeds;
    DROP TABLE IF EXISTS Species;

    -- Create Tables
    CREATE TABLE Species (
        species_id INT AUTO_INCREMENT PRIMARY KEY,
        common_name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255),
        diet_type ENUM('insectivore', 'granivore', 'omnivore', 'carnivore', 'herbivore') NOT NULL
    );

    CREATE TABLE Owners (
        owner_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255)
    );

    CREATE TABLE Feeds (
        feed_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type ENUM('seed', 'insect', 'fruit', 'formula', 'other') NOT NULL,
        notes TEXT
    );

    CREATE TABLE Birds (
        bird_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        species_id INT NOT NULL,
        owner_id INT,
        date_of_birth DATE,
        sex ENUM('M', 'F', 'unknown') NOT NULL DEFAULT 'unknown',
        admission_date DATE NOT NULL,
        current_status ENUM('in treatment','transferred','released','deceased') NOT NULL,
        reason_for_admission TEXT,
        notes TEXT,

        CONSTRAINT fk_birds_species
            FOREIGN KEY (species_id) REFERENCES Species(species_id)
            ON UPDATE CASCADE ON DELETE RESTRICT,

        CONSTRAINT fk_birds_owner
            FOREIGN KEY (owner_id) REFERENCES Owners(owner_id)
            ON UPDATE CASCADE ON DELETE SET NULL
    );

    CREATE TABLE Feeding_logs (
        feeding_id INT AUTO_INCREMENT PRIMARY KEY,
        bird_id INT NOT NULL,
        feed_id INT NOT NULL,
        amount DECIMAL(5,2),
        date_time DATETIME NOT NULL,

        CONSTRAINT fk_feeding_bird
            FOREIGN KEY (bird_id) REFERENCES Birds(bird_id)
            ON UPDATE CASCADE ON DELETE CASCADE,

        CONSTRAINT fk_feeding_feed
            FOREIGN KEY (feed_id) REFERENCES Feeds(feed_id)
            ON UPDATE CASCADE ON DELETE CASCADE
    );

    -- Insert Sample Data
    INSERT INTO Species (common_name, scientific_name, diet_type) VALUES
    ('Cockatiel', 'Nyphicus hollandicus', 'herbivore'),
    ('Peregrine Falcon', 'Falco peregrinus', 'carnivore'),
    ('Mallard Duck', 'Anas platyrhynchos', 'omnivore');

    INSERT INTO Owners (name, address, phone, email) VALUES
    ('Bobby Milford', '123 Apple Blvd', '(123) 972-1234', 'bobbym@gmail.com'),
    ('Fredrick Jones', '444 Forest Ave', '(541) 009-0101', 'fredjo@gmail.com'),
    ('Henry Johnson', '1738 Hill Dr', '(123) 123-4567', 'henryj@gmail.com');

    INSERT INTO Feeds (name, type, notes) VALUES
    ('Peanut', 'seed', 'Natural, no flavor'),
    ('Worm', 'insect', NULL),
    ('Apple', 'fruit', NULL);

    INSERT INTO Birds (name, species_id, owner_id, date_of_birth, sex, admission_date, current_status, reason_for_admission, notes)
    SELECT 'Alfred', species_id, owner_id, '2023-04-10', 'M', '2025-07-10', 'released', 'Stopped eating', NULL
    FROM Species, Owners
    WHERE Species.common_name = 'Mallard Duck'
      AND Owners.name = 'Bobby Milford';

    INSERT INTO Birds (name, species_id, date_of_birth, sex, admission_date, current_status, reason_for_admission, notes)
    SELECT 'Unnamed Falcon', species_id, NULL, 'F', '2022-08-08', 'in treatment', 'Flew into window, broken right wing', NULL
    FROM Species
    WHERE Species.common_name = 'Peregrine Falcon';

    INSERT INTO Birds (name, species_id, owner_id, date_of_birth, sex, admission_date, current_status, reason_for_admission, notes)
    SELECT 'Joey', s.species_id, o.owner_id, '2024-03-12', 'M', '2025-10-26', 'in treatment',
           'Rescued from abusive owner', 'Underfed, stressed, plucked feathers.'
    FROM Species s
    JOIN Owners o ON o.name = 'Fredrick Jones'
    WHERE s.common_name = 'Cockatiel';

    INSERT INTO Birds (name, species_id, owner_id, date_of_birth, sex, admission_date, current_status, reason_for_admission)
    SELECT 'Polly', s.species_id, o.owner_id, '2022-01-15', 'F', '2025-10-30', 'in treatment', 'Kidney disease'
    FROM Species s
    JOIN Owners o ON o.name = 'Henry Johnson'
    WHERE s.common_name = 'Cockatiel';

    INSERT INTO Feeding_logs (bird_id, feed_id, amount, date_time)
    SELECT b.bird_id, f.feed_id, 5.00, '2025-09-01 06:00:00'
    FROM Birds b
    JOIN Feeds f ON f.name = 'Worm'
    WHERE b.name = 'Alfred';

    INSERT INTO Feeding_logs (bird_id, feed_id, amount, date_time)
    SELECT b.bird_id, f.feed_id, 5.00, '2025-10-27 17:45:00'
    FROM Birds b
    JOIN Feeds f ON f.name = 'Peanut'
    WHERE b.name = 'Joey';

    INSERT INTO Feeding_logs (bird_id, feed_id, amount, date_time)
    SELECT b.bird_id, f.feed_id, 1.00, '2025-10-30 19:00:00'
    FROM Birds b
    JOIN Feeds f ON f.name = 'Apple'
    WHERE b.name = 'Polly';

    SET FOREIGN_KEY_CHECKS = 1;
    COMMIT;
END //
DELIMITER ;

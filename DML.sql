/*
DML by Kellen Swanson and Mick Forsman
Group 58 - Happy Feathers Hospital and Rehabilitation 
Project Step 3 Draft
*/

-- We use @varName to denote values that the backend will replace dynamically
SELECT b.bird_id, b.name, s.common_name AS species, o.name AS owner,
       b.sex, b.admission_date, b.current_status
FROM Birds b
JOIN Species s ON b.species_id = s.species_id
LEFT JOIN Owners o ON b.owner_id = o.owner_id
ORDER BY b.name;

INSERT INTO Birds (name, species_id, owner_id, date_of_birth,
                   sex, admission_date, current_status,
                   reason_for_admission, notes)
VALUES (@birdName, @speciesID, @ownerID, @dateOfBirth,
        @sex, @admissionDate, @currentStatus,
        @reasonForAdmission, @notes);

UPDATE Birds
SET current_status = @newStatus
WHERE bird_id = @birdID;

UPDATE Birds
SET owner_id = @ownerID
WHERE bird_id = @birdID;

DELETE FROM Birds
WHERE bird_id = @birdID;

SELECT b.bird_id, b.name, s.common_name AS species, o.name AS owner,
       b.current_status
FROM Birds b
JOIN Species s ON b.species_id = s.species_id
LEFT JOIN Owners o ON b.owner_id = o.owner_id
WHERE (@speciesID IS NULL OR b.species_id = @speciesID)
  AND (@status IS NULL OR b.current_status = @status)
  AND (@ownerID IS NULL OR b.owner_id = @ownerID)
ORDER BY b.name;

SELECT owner_id, name, phone, email
FROM Owners
ORDER BY name;

INSERT INTO Owners (name, address, phone, email)
VALUES (@ownerName, @address, @phone, @email);

DELETE FROM Owners
WHERE owner_id = @ownerID;

SELECT species_id, common_name, scientific_name, diet_type
FROM Species
ORDER BY common_name;

INSERT INTO Species (common_name, scientific_name, diet_type)
VALUES (@commonName, @scientificName, @dietType);

UPDATE Species
SET diet_type = @dietType
WHERE species_id = @speciesID;

DELETE FROM Species
WHERE species_id = @speciesID;

SELECT fl.feeding_id, f.name AS feed_name, fl.amount, fl.date_time
FROM Feeding_logs fl
JOIN Feeds f ON fl.feed_id = f.feed_id
WHERE fl.bird_id = @birdID
ORDER BY fl.date_time DESC;

INSERT INTO Feeding_logs (bird_id, feed_id, amount, date_time)
VALUES (@birdID, @feedID, @amount, @dateTime);

UPDATE Feeding_logs
SET feed_id = @feedID,
    amount = @amount,
    date_time = @dateTime
WHERE feeding_id = @feedingID;

DELETE FROM Feeding_logs
WHERE feeding_id = @feedingID;

SELECT feed_id, name, type
FROM Feeds
ORDER BY name;
import express from "express";
import { db } from "../db.js";
const router = express.Router();

router.get("/", (req, res) => res.render("home", { title: "Home" }));
router.get("/birds", (req, res) => res.render("birds", { title: "View Birds" }));
router.get("/birds_new", (req, res) => res.render("birds_new", { title: "Add Bird" }));
router.get("/birds_update", (req, res) => res.render("birds_update", { title: "Update Birds" }));
router.get("/species", (req, res) => res.render("species", { title: "View Species" }));
router.get("/species_new", (req, res) => res.render("species_new", { title: "Add Species" }));
router.get("/species_update", (req, res) => res.render("species_update", { title: "Update Species" }));
router.get("/feeds", (req, res) => res.render("feeds", { title: "View Feeds" }));
router.get("/feeds_new", (req, res) => res.render("feeds_new", { title: "Add Feed" }));
router.get("/feeds_update", (req, res) => res.render("feeds_update", { title: "Update Feeds" }));
router.get("/feeding_logs", (req, res) => res.render("feeding_logs", { title: "View Feeding Logs" }));
router.get("/feeding_logs_new", (req, res) => res.render("feeding_logs_new", { title: "Add Feeding Log" }));
router.get("/feeding_logs_update", (req, res) => res.render("feeding_logs_update", { title: "Update Feeding Logs" }));
router.get("/owners", (req, res) => res.render("owners", { title: "View Owners" }));
router.get("/owners_new", (req, res) => res.render("owners_new", { title: "Add Owner" }));
router.get("/owners_update", (req, res) => res.render("owners_update", { title: "Update Owners" }));

router.post("/species_new", async (req, res) => {
  try {
    const { common_name, scientific_name, diet_type } = req.body;
    await db.execute(
      "INSERT INTO Species (common_name, scientific_name, diet_type) VALUES (?, ?, ?)",
      [common_name, scientific_name, diet_type]
    );
    res.redirect("/species");
  } catch (err) {
    console.error("Error inserting species:", err);
    res.status(500).send("Database error");
  }
});

router.post("/birds_new", async (req, res) => {
  try {
    const {
      name,
      species_id,
      owner_id,
      date_of_birth,
      sex,
      admission_date,
      current_status,
      reason_for_admission,
      notes
    } = req.body;

    await db.execute(
      `INSERT INTO Birds 
        (name, species_id, owner_id, date_of_birth, sex, admission_date, current_status, reason_for_admission, notes) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name, species_id, owner_id, date_of_birth,
        sex, admission_date, current_status,
        reason_for_admission, notes
      ]
    );
    res.redirect("/birds");
  } catch (err) {
    console.error("Error inserting bird:", err);
    res.status(500).send("Database error");
  }
});

router.post("/owners_new", async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;
    await db.execute(
      "INSERT INTO Owners (name, address, phone, email) VALUES (?, ?, ?, ?)",
      [name, address, phone, email]
    );
    res.redirect("/owners");
  } catch (err) {
    console.error("Error inserting owner:", err);
    res.status(500).send("Database error");
  }
});

router.post("/feeds_new", async (req, res) => {
  try {
    const { name, type, notes } = req.body;
    await db.execute(
      "INSERT INTO Feeds (name, type, notes) VALUES (?, ?, ?)",
      [name, type, notes]
    );
    res.redirect("/feeds");
  } catch (err) {
    console.error("Error inserting feed:", err);
    res.status(500).send("Database error");
  }
});

router.post("/feeding_logs_new", async (req, res) => {
  try {
    const { bird_id, feed_id, amount, date_time } = req.body;
    await db.execute(
      "INSERT INTO Feeding_logs (bird_id, feed_id, amount, date_time) VALUES (?, ?, ?, ?)",
      [bird_id, feed_id, amount, date_time]
    );
    res.redirect("/feeding_logs");
  } catch (err) {
    console.error("Error inserting log:", err);
    res.status(500).send("Database error");
  }
});

router.get("/species_update/:id", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM Species WHERE species_id=?",
      [req.params.id]
    );
    res.render("species_update", { species: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading species");
  }
});

router.post("/species_update/:id", async (req, res) => {
  try {
    const { common_name, scientific_name, diet_type } = req.body;

    await db.execute(
      `UPDATE Species 
       SET common_name=?, scientific_name=?, diet_type=? 
       WHERE species_id=?`,
      [common_name, scientific_name, diet_type, req.params.id]
    );

    res.redirect("/species");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating species");
  }
});

router.get("/birds_update/:id", async (req, res) => {
  try {
    const [birds] = await db.execute(
      "SELECT * FROM Birds WHERE bird_id=?",
      [req.params.id]
    );
    res.render("birds_update", { bird: birds[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading bird");
  }
});

router.post("/birds_update/:id", async (req, res) => {
  try {
    const {
      name, species_id, owner_id, date_of_birth,
      sex, admission_date, current_status,
      reason_for_admission, notes
    } = req.body;

    await db.execute(
      `UPDATE Birds SET 
        name=?, species_id=?, owner_id=?, date_of_birth=?,
        sex=?, admission_date=?, current_status=?,
        reason_for_admission=?, notes=?
       WHERE bird_id=?`,
      [
        name, species_id, owner_id, date_of_birth,
        sex, admission_date, current_status,
        reason_for_admission, notes,
        req.params.id
      ]
    );

    res.redirect("/birds");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating bird");
  }
});

router.get("/owners_update/:id", async (req, res) => {
  try {
    const [owners] = await db.execute(
      "SELECT * FROM Owners WHERE owner_id=?",
      [req.params.id]
    );
    res.render("owners_update", { owner: owners[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading owner");
  }
});

router.post("/owners_update/:id", async (req, res) => {
  try {
    const { name, address, phone, email } = req.body;

    await db.execute(
      `UPDATE Owners SET 
        name=?, address=?, phone=?, email=? 
       WHERE owner_id=?`,
      [name, address, phone, email, req.params.id]
    );

    res.redirect("/owners");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating owner");
  }
});

router.get("/feeds_update/:id", async (req, res) => {
  try {
    const [feeds] = await db.execute(
      "SELECT * FROM Feeds WHERE feed_id=?",
      [req.params.id]
    );
    res.render("feeds_update", { feed: feeds[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading feed");
  }
});

router.post("/feeds_update/:id", async (req, res) => {
  try {
    const { name, type, notes } = req.body;

    await db.execute(
      `UPDATE Feeds SET 
        name=?, type=?, notes=? 
      WHERE feed_id=?`,
      [name, type, notes, req.params.id]
    );

    res.redirect("/feeds");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating feed");
  }
});

router.get("/feeding_logs_update/:id", async (req, res) => {
  try {
    const [logs] = await db.execute(
      "SELECT * FROM Feeding_logs WHERE feeding_id=?",
      [req.params.id]
    );
    res.render("feeding_logs_update", { log: logs[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading feeding log");
  }
});

router.post("/feeding_logs_update/:id", async (req, res) => {
  try {
    const { bird_id, feed_id, amount, date_time } = req.body;

    await db.execute(
      `UPDATE Feeding_logs SET 
        bird_id=?, feed_id=?, amount=?, date_time=?
      WHERE feeding_id=?`,
      [bird_id, feed_id, amount, date_time, req.params.id]
    );

    res.redirect("/feeding_logs");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating feeding log");
  }
});

export default router;

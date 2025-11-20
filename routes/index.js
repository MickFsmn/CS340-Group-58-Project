import express from "express";
import { db } from "../db.js";
const router = express.Router();

/*  TRIED TO ORDER THINGS AS FOLLOWS: BIRDS -> FEEDING LOGS -> FEEDS -> OWNERS -> SPECIES  */

/* ------ Home page ----- */
router.get("/", (req, res) => res.render("home", { title: "Home" }));


/* ----- GET/VIEW ----- */
router.get("/birds", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Birds");
    res.render("birds", { title: "View Birds", birds: rows });
  } catch (err) {
    console.error("Error loading birds:", err);
    res.status(500).send("Error loading birds");
  }
});

router.get("/feeding_logs", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Feeding_logs");
    res.render("feeding_logs", { title: "View Feeding Logs", feeding_logs: rows });
  } catch (err) {
    console.error("Error loading feeding logs:", err);
    res.status(500).send("Error loading feeding logs");
  }
});

router.get("/feeds", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Feeds");
    res.render("feeds", { title: "View Feeds", feeds: rows });
  } catch (err) {
    console.error("Error loading feeds:", err);
    res.status(500).send("Error loading feeds");
  }
});

router.get("/owners", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Owners");
    res.render("owners", { title: "View Owners", owners: rows });
  } catch (err) {
    console.error("Error loading owners:", err);
    res.status(500).send("Error loading owners");
  }
});

router.get("/species", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM Species");
    res.render("species", { title: "View Species", species: rows });
  } catch (err) {
    console.error("Error loading species:", err);
    res.status(500).send("Error loading species");
  }
});

/* ----- GET/NEW ----- */

router.get("/birds_new", async (req, res) => {
  try {
    const [speciesRows] = await db.execute("SELECT * FROM Species");
    const [ownerRows] = await db.execute("SELECT * FROM Owners");
    console.log("ownerrows:", ownerRows);
    console.log("speciesrows:", speciesRows);
    res.render("birds_new", { title: "Add Bird", species: speciesRows, owners: ownerRows });
  } catch (err) {
    console.error("Error loading bird form data:", err);
    res.status(500).send("Error preparing new bird form");
  }
});

router.get("/feeding_logs_new", async (req, res) => {
  try {
    const [birdRows] = await db.execute("SELECT * FROM Birds");
    const [feedRows] = await db.execute("SELECT * FROM Feeds");
    console.log("birdRows:", birdRows);
    console.log("feedRows:", feedRows);

    res.render("feeding_logs_new", { title: "Add Feeding Log", birds: birdRows, feeds: feedRows });
  } catch (err) {
    console.error("Error loading feeding logs new form data:", err);
    res.status(500).send("Error preparing new feeding log form");
  }
});


/* ----- POST/NEW ----- */

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

/* ----- POST/DELETE ----- */

router.post("/birds_delete/:id", async (req, res) => {
  try {
    const birdId = req.params.id;

    const [result] = await db.execute(
      "DELETE FROM Birds WHERE bird_id = ?",
      [birdId]
    );

    if (result.affectedRows && result.affectedRows > 0) {
      res.redirect("/birds");
    } else {
      res.status(404).send("Bird not found");
    }
  } catch (err) {
    console.error("Error deleting bird:", err);
    res.status(500).send("Error deleting bird - check for dependent records or DB constraints.");
  }
});

router.post("/feeding_logs_delete/:id", async (req, res) => {
  try {
    const FeedingId = req.params.id;

    const [result] = await db.execute(
      "DELETE FROM Feeding_logs WHERE feeding_id = ?",
      [FeedingId]
    );

    if (result.affectedRows && result.affectedRows > 0) {
      res.redirect("/feeding_logs");
    } else {
      res.status(404).send("Feeding log not found");
    }

  } catch (err) {
    console.error("Error deleting feeding log:", err);
    res.status(500).send("Error deleting feeding log - check for dependent records or DB constraints.");
  }
});

router.post("/feeds_delete/:id", async (req, res) => {
  try {
    const FeedId = req.params.id;

    await db.execute(
      "UPDATE Feeding_Logs SET feed_id = NULL WHERE feed_id = ?",
      [FeedId]
    );

    const [result] = await db.execute(
      "DELETE FROM Feeds WHERE feed_id = ?",
      [FeedId]
    );

    if (result.affectedRows && result.affectedRows > 0) {
      res.redirect("/feeds");
    } else {
      res.status(404).send("Feed not found");
    }
  } catch (err) {
    console.error("Error deleting feed:", err);
    res.status(500).send("Error deleting feed - check for dependent records or DB constraints.");
  }
});

router.post("/owners_delete/:id", async (req, res) => {
  const OwnerId = req.params.id;

  try {
    await db.execute(
      "DELETE FROM Birds WHERE owner_id = ?",
      [OwnerId]
    );

    const [result] = await db.execute(
      "DELETE FROM Owners WHERE owner_id = ?",
      [OwnerId]
    );

    if (result.affectedRows && result.affectedRows > 0) {
      res.redirect("/owners");
    } else {
      res.status(404).send("owner not found");
    }

  } catch (err) {
    console.error("Error deleting owner:", err);
    res.status(500).send("Error deleting owner - check for dependent records or DB constraints.");
  }
});

router.post("/species_delete/:id", async (req, res) => {
  const speciesId = req.params.id;

  try {
    const [birds] = await db.execute(
      "SELECT COUNT(*) AS count FROM Birds WHERE species_id = ?",
      [speciesId]
    );

    if (birds[0].count > 0) {
      return res.status(400).send(
        `Cannot delete species. ${birds[0].count} bird(s) still belong to this species.`
      );
    }

    const [result] = await db.execute(
      "DELETE FROM Species WHERE species_id = ?",
      [speciesId]
    );

    if (result.affectedRows && result.affectedRows > 0) {
      res.redirect("/species");
    } else {
      res.status(404).send("Species not found");
    }

  } catch (err) {
    console.error("Error deleting species:", err);
    res.status(500).send("Error deleting species - check for dependent records or DB constraints.");
  }
});

/* ----- GET/UPDATE ----- */

router.get("/birds_update/:id", async (req, res) => {
  try {
    const birdId = req.params.id;

    const [[bird]] = await db.execute("SELECT * FROM Birds WHERE bird_id = ?", [birdId]);

    if (!bird) {
      return res.status(404).send("Bird not found");
    }

    const [species] = await db.execute("SELECT * FROM Species");
    const [owners] = await db.execute("SELECT * FROM Owners");

    if (bird.date_of_birth) {
      bird.date_of_birth = bird.date_of_birth.toISOString().split("T")[0];
    }
    if (bird.admission_date) {
      bird.admission_date = bird.admission_date.toISOString().split("T")[0];
    }

    res.render("birds_update", { bird, species, owners });
  } catch (err) {
    console.error("Error loading bird:", err);
    res.status(500).send("Error loading bird");
  }
});

// FORMAT DATE HELPER

function formatForDatetimeLocal(date) {
  if (!date) return "";
  
  const pad = (n) => n.toString().padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


router.get("/feeding_logs_update/:id", async (req, res) => {
  try {
    const [logs] = await db.execute(
      "SELECT * FROM Feeding_logs WHERE feeding_id = ?",
      [req.params.id]
    );

    if (logs.length === 0) {
      return res.status(404).send("Feeding log not found");
    }

    const log = logs[0]; 

    log.date_time = formatForDatetimeLocal(new Date(log.date_time));

    const [birds] = await db.execute("SELECT * FROM Birds");
    const [feeds] = await db.execute("SELECT * FROM Feeds");

    res.render("feeding_logs_update", { birds, feeds, log });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading feeding log");
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

/* ----- POST/UPDATE ----- */

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

/* ----- RESET PROCEDURE ------*/
router.post("/reset", async (req, res) => {
  try {
    await db.query("CALL sp_reset_hfh()");
    res.send(`
      <html>
        <body>
          <p>Database has been reset. Redirecting...</p>
          <meta http-equiv="refresh" content="1;url=/" />
        </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting database");
  }
});

/* ----- Additional GET routes for rendering pages without data / leftovers from old versions ----- */
router.get("/birds_update", (req, res) => res.render("birds_update", { title: "Update Birds" }));
router.get("/species", (req, res) => res.render("species", { title: "View Species" }));
router.get("/species_new", (req, res) => res.render("species_new", { title: "Add Species" }));
router.get("/species_update", (req, res) => res.render("species_update", { title: "Update Species" }));
router.get("/feeds", (req, res) => res.render("feeds", { title: "View Feeds" }));
router.get("/feeds_new", (req, res) => res.render("feeds_new", { title: "Add Feed" }));
router.get("/feeds_update", (req, res) => res.render("feeds_update", { title: "Update Feeds" }));
router.get("/feeding_logs", (req, res) => res.render("feeding_logs", { title: "View Feeding Logs" }));
router.get("/feeding_logs_update", (req, res) => res.render("feeding_logs_update", { title: "Update Feeding Logs" }));
router.get("/owners", (req, res) => res.render("owners", { title: "View Owners" }));
router.get("/owners_new", (req, res) => res.render("owners_new", { title: "Add Owner" }));
router.get("/owners_update", (req, res) => res.render("owners_update", { title: "Update Owners" }));


export default router;

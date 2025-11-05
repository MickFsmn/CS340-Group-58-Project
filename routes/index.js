import express from "express";
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

export default router;

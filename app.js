import express from "express";
import { engine } from "express-handlebars";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// port
const PORT = process.env.PORT || 2837;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// handlebars
app.engine("hbs", engine({ 
  extname: ".hbs",
  defaultLayout: "main",         
  layoutsDir: path.join(__dirname, "views/layouts")}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// routes
app.use("/", routes);

// start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}, or http://classwork.engr.oregonstate.edu:${PORT}`));

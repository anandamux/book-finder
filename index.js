import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Rota Principal
app.get("/", (req, res) => {
  res.render("index");
});

// Rota de Recomendação Aleatória
app.get("/recommend", async (req, res) => {
  const genre = req.query.genre || "fiction";

  try {
    const response = await axios.get(`https://openlibrary.org/search.json`, {
      params: {
        q: `subject:${genre}`,
        fields: "title,author_name,cover_i,first_publish_year,key",
        limit: 40,
      },
    });

    const books = response.data.docs;

    if (books && books.length > 0) {
      const randomIndex = Math.floor(Math.random() * books.length);
      const selectedBook = books[randomIndex];

      res.render("recommendation", {
        book: selectedBook,
        genre: genre.replace("_", " "),
      });
    } else {
      res.render("recommendation", { book: null, genre: genre });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BookFinder running at http://localhost:${PORT}`);
});

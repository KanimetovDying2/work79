import "dotenv/config";
import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories/categories";

console.log("DEBUG: DB_USER is", process.env.DB_USER);

// import itemsRouter from "./routes/items/items";
// import placesRouter from "./routes/places/places";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/categories", categoriesRouter);
// app.use("/items", itemsRouter);
// app.use("/places", placesRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

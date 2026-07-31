import { Router } from "express";
import { pool } from "../../db";

const categoriesRouter = Router();

categoriesRouter.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories");
    console.log(rows);

    res.json(rows);
  } catch (error) {
    console.error("Error. Cannot send categories table", error);
    res.status(500).json({ error: "Error. Cannot send categories table" });
  }
});

export default categoriesRouter;

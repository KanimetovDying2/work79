import { Router } from "express";
import { pool } from "../../db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const categoriesRouter = Router();

interface Category extends RowDataPacket {
  id: number;
  name: string;
}

categoriesRouter.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<Category[]>(
      "SELECT id, name FROM categories",
    );
    console.log(rows);

    res.json(rows);
  } catch (error) {
    console.error("Error. Cannot send categories table", error);
    res.status(500).json({ error: "Error. Cannot send categories table" });
  }
});

categoriesRouter.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query<Category[]>(
      "SELECT * FROM categories WHERE id = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Sorry. That category is not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

categoriesRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Error. Name is required!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description],
    );

    res.json({ id: result.insertId, name, description });
  } catch (error) {
    console.error("Error. Cannot send categories table", error);
    res.status(500).json({ error: "Error. Cannot send categories table" });
  }
});

categoriesRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [items] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM items WHERE category_id = ?",
      [id],
    );

    if (items.length > 0) {
      return res.status(400).json({
        error: "Error. Can't delete if this item hase FK connections!",
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM categories WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Error. This category not found to be deleted!" });
    }

    res.json({ message: "This category was deleted successfuly!" });
  } catch (error) {
    console.error("Error. Cannot delete category", error);
    res.status(500).json({ error: "Error. Cannot delete category" });
  }
});

categoriesRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Error. Name is required!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Error. That category not found to be changed." });
    }

    res.json({ id: parseInt(id), name, description });
  } catch (error) {
    console.error("Error updating category", error);
    res.status(500).json({ error: "Can't update that category" });
  }
});

export default categoriesRouter;

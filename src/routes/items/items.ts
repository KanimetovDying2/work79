import { Router } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../../db";
import { imagesUpload } from "../../middleware/upload";

const itemsRouter = Router();

interface Item extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  category_id: number;
  place_id: number;
  photo: string | null;
  created_at: string;
}

type ItemCreate = Omit<Item, "id" | "created_at">;

itemsRouter.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<Item[]>("SELECT id, name FROM items");
    res.json(rows);
  } catch (error) {
    console.error(error, "Error fetch/");
    res.status(500).json({ error: "Error. Can't fetch items" });
  }
});

itemsRouter.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query<Item[]>(
      "SELECT * FROM items WHERE id = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Sorry but that item was not found." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error, "Error. Error fetch item");
    res.status(500).json({ error: "Error. Server error" });
  }
});

itemsRouter.post("/", imagesUpload.single("photo"), async (req, res) => {
  try {
    const { name, description, category_id, place_id } = req.body as ItemCreate;
    const photoPath = req.file ? req.file.filename : null;

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO items (name, description, category_id, place_id, photo) VALUES (?, ?, ?, ?, ?)",
      [name, description, category_id, place_id, photoPath],
    );

    res.status(201).json({
      id: result.insertId,
      name,
      photo: photoPath,
    });
  } catch (error) {
    console.error("Database fail to insert:", error);
    res.status(500).json({ error: "Error fail to create item" });
  }
});

itemsRouter.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM items WHERE id = ?",
      [req.params.id],
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({
        error: "Item not found!",
      });
    }
    res.json({ message: "Item was deleted successfully" });
  } catch (error) {
    console.error("Delete error", error);
    res.status(500).json({ error: "Server error" });
  }
});

itemsRouter.put("/:id", async (req, res) => {
  try {
    const { name, description, category_id, place_id, photo } =
      req.body as ItemCreate;
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE items SET name = ?, description = ?, category_id = ?, place_id = ?, photo = ? WHERE id = ?",
      [name, description, category_id, place_id, photo, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json({
      id: Number(id),
      name,
      description,
      category_id,
      place_id,
      photo,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

export default itemsRouter;

import { Router } from "express";
import { pool } from "../../db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

const placesRouter = Router();

interface Place extends RowDataPacket {
  id: number;
  name: string;
}

placesRouter.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query<Place[]>("SELECT id, name FROM places");
    console.log(rows);

    res.json(rows);
  } catch (error) {
    console.error("Error. Cannot send places table", error);
    res.status(500).json({ error: "Error. Cannot send places table" });
  }
});

placesRouter.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query<Place[]>(
      "SELECT * FROM places WHERE id = ?",
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Sorry. That place is not found." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching place:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

placesRouter.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Error. Name is required!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "INSERT INTO places (name, description) VALUES (?, ?)",
      [name, description],
    );

    res.json({ id: result.insertId, name, description });
  } catch (error) {
    console.error("Error. Cannot send places table", error);
    res.status(500).json({ error: "Error. Cannot send places table" });
  }
});

placesRouter.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const [items] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM items WHERE place_id = ?",
      [id],
    );

    if (items.length > 0) {
      return res.status(400).json({
        error: "Error. Can't delete if this item hase FK connections!",
      });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM places WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Error. This place not found to be deleted!" });
    }

    res.json({ message: "This place was deleted successfuly!" });
  } catch (error) {
    console.error("Error. Cannot delete place", error);
    res.status(500).json({ error: "Error. Cannot delete place" });
  }
});

placesRouter.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Error. Name is required!" });
    }

    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE places SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Error. That place not found to be changed." });
    }

    res.json({ id: parseInt(id), name, description });
  } catch (error) {
    console.error("Error updating place", error);
    res.status(500).json({ error: "Can't update that place" });
  }
});

export default placesRouter;

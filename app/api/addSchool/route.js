import fs from "fs";
import path from "path";
import { connectToDb } from "@/lib/db";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") {
        fields[key] = value;
      }
    }

    const imageFile = formData.get("image");
    if (!imageFile || typeof imageFile === "string") {
      return new Response(JSON.stringify({ message: "No image uploaded" }), { status: 400 });
    }

    const buffer = await imageFile.arrayBuffer();
    const bytes = Buffer.from(buffer);
    const uploadDir = path.join(process.cwd(), "uploads/schoolImages");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const newFileName = Date.now() + "_" + imageFile.name;
    const newPath = path.join(uploadDir, newFileName);
    await fs.promises.writeFile(newPath, bytes);

    const imagePathForFrontend = `/api/images?filename=${newFileName}`;

    // Save to database
    const db = await connectToDb();
   await db.query(
  `INSERT INTO schools (name, address, city, state, contact, email_id, image)
   VALUES ($1, $2, $3, $4, $5, $6, $7)`,
  [fields.name, fields.address, fields.city, fields.state, fields.contact, fields.email_id, imagePathForFrontend]
);

    return new Response(JSON.stringify({
      message: "School added successfully",
      imagePath: imagePathForFrontend,
    }), { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ message: "Error uploading school" }), { status: 500 });
  }
}
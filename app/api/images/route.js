import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    if (!filename) {
      return new Response(JSON.stringify({ message: "Filename required" }), { status: 400 });
    }

    const filePath = path.join(process.cwd(), "uploads/schoolImages", filename);
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ message: "Image not found" }), { status: 404 });
    }

    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      "application/octet-stream";

    const fileBuffer = await fs.promises.readFile(filePath);
    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Image read error:", err);
    return new Response(JSON.stringify({ message: "Error reading image" }), { status: 500 });
  }
}
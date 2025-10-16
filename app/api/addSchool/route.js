import { connectToDb } from "@/lib/db";
import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary Configuration (use environment variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Extract text fields
    const fields = {};
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") fields[key] = value;
    }

    // Extract image file
    const imageFile = formData.get("image");
    if (!imageFile || typeof imageFile === "string") {
      return new Response(
        JSON.stringify({ message: "No image uploaded" }),
        { status: 400 }
      );
    }

    // Convert image to buffer for Cloudinary upload
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: "schoolImages" }, // Optional folder name in Cloudinary
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Save school data in DB
    const db = await connectToDb();
    await db.query(
      `INSERT INTO schools (name, address, city, state, contact, email_id, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        fields.name,
        fields.address,
        fields.city,
        fields.state,
        fields.contact,
        fields.email_id,
        uploadResult.secure_url, // ✅ Use Cloudinary image URL
      ]
    );

    // Send success response
    return new Response(
      JSON.stringify({
        message: "School added successfully",
        imageUrl: uploadResult.secure_url,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ message: "Error uploading school" }),
      { status: 500 }
    );
  }
}

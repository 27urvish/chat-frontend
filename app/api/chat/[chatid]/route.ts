// import { NextRequest } from "next/server";
// import formidable from "formidable";
// import { promises as fs } from "fs";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   try {
//     // Parse form data
//     const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });
//     const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
//       form.parse(req as any, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     // Example: get file info
//     const file = data.files.file;
//     const fileName = file.originalFilename;
//     const fileUrl = `/uploads/${file.newFilename}`;

//     return new Response(JSON.stringify({
//       fileName,
//       fileUrl,
//       fileType: file.mimetype,
//       fileSize: file.size,
//     }), { status: 200 });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }


import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
    }

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    return new Response(JSON.stringify({
      fileName: file.name,
      fileUrl,
      fileType: file.type,
      fileSize: file.size,
    }), { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
import { Hono } from "hono";
import * as fal from "@fal-ai/serverless-client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import mysql from "mysql2/promise";
import { cors } from "hono/cors";

const s3Client = new S3Client({
  region: "ap-northeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

fal.config({
  credentials: process.env.FAL_KEY,
});

const app = new Hono();

let db: mysql.Connection;

async function connectToDatabase() {
  try {
    db = await mysql.createConnection(process.env.DATABASE_URL!);
    console.log("Connected to the database");

    // Initialize the database
    await db.query(`CREATE TABLE IF NOT EXISTS images (
      seed VARCHAR(255) PRIMARY KEY,
      image_name VARCHAR(255)
    )`);
    console.log("Database initialized");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    process.exit(1);
  }
}

await connectToDatabase();

app.use("/*", cors());

app.get("/", (c) => {
  return c.text("dugdug");
});

app.get("/image/:seed/:prompt", async (c) => {
  const seed = c.req.param("seed");
  const prompt = c.req.param("prompt");

  // Check if the image exists in the database
  const [rows]: any = await db.execute(
    "SELECT image_name FROM images WHERE seed = ?",
    [seed]
  );
  const existingImageName = rows.length ? rows[0].image_name : null;

  console.log(existingImageName);

  if (existingImageName) {
    return c.text(
      `https://dugdugdug.s3.ap-northeast-1.amazonaws.com/${existingImageName}`,
      200
    );
  }

  // If not found, generate a new image name and store it in the database
  const imageName = `image_${seed}.png`;

  console.log(imageName);

  const image = await fal.subscribe("fal-ai/flux-pro", {
    input: {
      prompt: `${prompt}  pixel art cave`,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === "IN_PROGRESS") {
        // You can add any additional logic here if needed
      }
    },
  });

  const imageUrl = (image as any)?.images?.[0]?.url;
  if (!imageUrl) {
    return c.text("Failed to generate image", 500);
  }

  console.log(imageUrl);

  // Download the image
  const response = await fetch(imageUrl);
  const imageBuffer = await response.arrayBuffer();

  // Upload to S3
  const s3Key = `images/${imageName}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: "dugdugdug",
      Key: s3Key,
      Body: Buffer.from(imageBuffer),
      ContentType: "image/png",
    })
  );

  await db.execute("INSERT INTO images (seed, image_name) VALUES (?, ?)", [
    seed,
    s3Key,
  ]);

  return c.text(
    `https://dugdugdug.s3.ap-northeast-1.amazonaws.com/images/${imageName}`,
    200
  );
});

export default app;

import { Hono } from "hono";
import { Database } from "sqlite3";
import * as fal from "@fal-ai/serverless-client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const s3Client = new S3Client({
    region: "ap-northeast-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
fal.config({
    credentials: process.env.FAL_KEY,
});
const app = new Hono();
const db = new Database("images.db");
// Initialize the database
db.run(`CREATE TABLE IF NOT EXISTS images (
  seed TEXT PRIMARY KEY,
  image_name TEXT
)`);
app.get("/", (c) => {
    return c.text("Hello Hono!");
});
app.get("/image/:seed/:prompt", async (c) => {
    const seed = c.req.param("seed");
    const prompt = c.req.param("prompt");
    // Check if the image exists in the database
    const existingImageName = await new Promise((resolve) => {
        db.get("SELECT image_name FROM images WHERE seed = ?", [seed], (err, row) => {
            resolve(row ? row.image_name : null);
        });
    });
    if (existingImageName) {
        return c.text(`https://dugdugdug.s3.ap-northeast-1.amazonaws.com/${existingImageName}`, 200);
    }
    // If not found, generate a new image name and store it in the database
    const imageName = `image_${seed}.png`;
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
    const imageUrl = image?.images?.[0]?.url;
    if (!imageUrl) {
        return c.text("Failed to generate image", 500);
    }
    // Download the image
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    // Upload to S3
    const s3Key = `images/${imageName}`;
    await s3Client.send(new PutObjectCommand({
        Bucket: "dugdugdug",
        Key: s3Key,
        Body: Buffer.from(imageBuffer),
        ContentType: "image/png",
    }));
    await new Promise((resolve, reject) => {
        db.run("INSERT INTO images (seed, image_name) VALUES (?, ?)", [seed, s3Key], (err) => {
            if (err)
                reject(err);
            else
                resolve(s3Key);
        });
    });
    return c.text(`https://dugdugdug.s3.ap-northeast-1.amazonaws.com/images/${imageName}`, 200);
});
export default app;

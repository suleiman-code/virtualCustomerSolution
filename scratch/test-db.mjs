import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    console.error("❌ ERROR: DATABASE_URL not found in .env");
    return;
  }

  const client = new MongoClient(uri);
  try {
    console.log("⏳ Connecting to MongoDB...");
    await client.connect();
    console.log("✅ SUCCESS: Successfully connected to MongoDB!");
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(`📂 Database Name: ${db.databaseName}`);
    console.log(`📊 Found ${collections.length} collections.`);
    
  } catch (err) {
    console.error("❌ CONNECTION FAILED:", err.message);
  } finally {
    await client.close();
  }
}

testConnection();

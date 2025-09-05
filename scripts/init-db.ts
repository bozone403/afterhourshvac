import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users } from "../shared/schema-sqlite";
import { eq } from "drizzle-orm";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

const sqlite = new Database("database.sqlite");
const db = drizzle(sqlite);

async function initializeDatabase() {
  try {
    console.log("Initializing database...");
    
    // Create users table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        first_name TEXT,
        last_name TEXT,
        company TEXT,
        role TEXT DEFAULT 'user',
        user_type TEXT DEFAULT 'customer',
        has_pro_access INTEGER DEFAULT 0,
        has_pro INTEGER DEFAULT 0,
        is_admin INTEGER DEFAULT 0,
        is_lifetime_member INTEGER DEFAULT 0,
        phone_verified INTEGER DEFAULT 0,
        created_at TEXT,
        last_login TEXT
      )
    `);

    const adminUsers = [
      {
        username: "jordan_admin",
        email: "Jordan@Afterhourshvac.ca",
        firstName: "Jordan",
        lastName: "Bozanich"
      },
      {
        username: "derek_admin", 
        email: "Derek@Afterhourshvac.ca",
        firstName: "Derek",
        lastName: "Admin"
      },
      {
        username: "admin_main",
        email: "Admin@afterhourshvac.ca", 
        firstName: "Admin",
        lastName: "User"
      }
    ];

    for (const adminUser of adminUsers) {
      // Check if admin user already exists by email using raw SQL
      const existingAdmin = sqlite.prepare("SELECT * FROM users WHERE email = ?").get(adminUser.email);
      
      if (!existingAdmin) {
        console.log(`Creating admin user: ${adminUser.email}...`);
        
        // Hash the password
        const hashedPassword = await hashPassword("password");
        
        // Insert admin user using raw SQL to avoid schema issues
        sqlite.prepare(`
          INSERT INTO users (
            username, password, email, first_name, last_name, 
            role, user_type, has_pro_access, has_pro, is_admin, 
            is_lifetime_member, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          adminUser.username,
          hashedPassword,
          adminUser.email,
          adminUser.firstName,
          adminUser.lastName,
          "admin",
          "professional",
          1,
          1,
          1,
          1,
          new Date().toISOString()
        );
        
        console.log(`Admin user ${adminUser.email} created successfully`);
      } else {
        console.log(`Admin user ${adminUser.email} already exists`);
      }
    }
    
    console.log("Database initialization complete");
    console.log('Admin users can now log in with their email and password "password"');
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  } finally {
    sqlite.close();
  }
}

initializeDatabase();

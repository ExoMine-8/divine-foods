const path = require("path");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const speakeasy = require("speakeasy");
require("dotenv").config();

const app = express();

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self';");
  next();
});

// Use JSON body parsing for API routes. No view engine required for this project.
app.use(express.json());

// Configure a simple, secure-enough session store for a single admin.
// For a solo developer and single admin this in-memory store is acceptable,
// and keeps the setup simple and easy to run locally.
app.use(
  session({
    name: "admin.sid",
    secret: process.env.SESSION_SECRET || "dev-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    }
  })
);

const dbDir = path.join(__dirname, "data");
const dbPath = path.join(dbDir, "admin.db");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new sqlite3.Database(dbPath);

// Create minimal tables for a single admin and product management.
// No roles table is used; we assume exactly one admin row.
function runMigrations() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        mfa_secret TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT,
        inventory INTEGER NOT NULL DEFAULT 0,
        sort_order INTEGER NOT NULL DEFAULT 0,
        archived INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS product_versions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        snapshot_json TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(product_id) REFERENCES products(id)
      )`
    );
    db.run(
      `CREATE TABLE IF NOT EXISTS activity_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        product_id INTEGER,
        details TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`
    );
  });
}

// Seed the single admin row from environment variables if not present.
// This keeps credentials out of the codebase and is easy to change later.
function initializeAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const mfaSecret = process.env.ADMIN_MFA_SECRET;
  if (!email || !passwordHash || !mfaSecret) {
    return;
  }
  db.get("SELECT id FROM admin WHERE id = 1", [], (err, row) => {
    if (err) {
      return;
    }
    if (row) {
      return;
    }
    db.run(
      "INSERT INTO admin (id, email, password_hash, mfa_secret) VALUES (1, ?, ?, ?)",
      [email, passwordHash, mfaSecret]
    );
  });
}

runMigrations();
initializeAdmin();

const MFA_WINDOW = 1;

// Simple accessor to read the single admin row.
function getAdmin(callback) {
  db.get("SELECT * FROM admin WHERE id = 1", [], callback);
}

// Middleware that ensures a session exists and MFA has been completed.
function requireAdmin(req, res, next) {
  if (!req.session || !req.session.adminId || !req.session.mfaVerified) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Password login: sets session state but requires a separate MFA step.
app.post("/admin/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  getAdmin((err, adminRow) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!adminRow || adminRow.email !== email) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const ok = bcrypt.compareSync(password, adminRow.password_hash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    req.session.adminId = 1;
    req.session.mfaVerified = false;
    res.json({ status: "mfa_required" });
  });
});

// MFA verification: validates the TOTP code and completes the login.
app.post("/admin/auth/mfa", (req, res) => {
  const { code } = req.body || {};
  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }
  if (!req.session || req.session.adminId !== 1) {
    return res.status(401).json({ error: "Login required before MFA" });
  }
  getAdmin((err, adminRow) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!adminRow) {
      return res.status(500).json({ error: "Admin not configured" });
    }
    const verified = speakeasy.totp.verify({
      secret: adminRow.mfa_secret,
      encoding: "base32",
      token: code,
      window: MFA_WINDOW
    });
    if (!verified) {
      return res.status(401).json({ error: "Invalid code" });
    }
    req.session.mfaVerified = true;
    res.json({ status: "ok" });
  });
});

// Logout clears the session cookie.
app.post("/admin/auth/logout", (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.json({ status: "ok" });
    });
  } else {
    res.json({ status: "ok" });
  }
});

// List products with optional search and archived filter.
app.get("/admin/api/products", requireAdmin, (req, res) => {
  const { q, includeArchived } = req.query;
  const params = [];
  let where = "1=1";
  if (!includeArchived) {
    where += " AND archived = 0";
  }
  if (q) {
    where += " AND (name LIKE ? OR description LIKE ?)";
    const like = `%${q}%`;
    params.push(like, like);
  }
  const sql = `SELECT * FROM products WHERE ${where} ORDER BY archived ASC, sort_order ASC, created_at DESC`;
  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    res.json({ products: rows });
  });
});

// Create a new product. Uses a transaction to keep product + log consistent.
app.post("/admin/api/products", requireAdmin, (req, res) => {
  const { name, description, price, image_url, inventory } = req.body || {};
  if (!name || !description || typeof price !== "number" || typeof inventory !== "number") {
    return res.status(400).json({ error: "Invalid product data" });
  }
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    db.run(
      `INSERT INTO products (name, description, price, image_url, inventory, sort_order, archived)
       VALUES (?, ?, ?, ?, ?, 0, 0)`,
      [name.trim(), description.trim(), price, image_url || "", inventory],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: "Server error" });
        }
        const productId = this.lastID;
        db.run(
          "INSERT INTO activity_logs (action, product_id, details) VALUES (?, ?, ?)",
          ["create", productId, JSON.stringify({ name, price, inventory })],
          logErr => {
            if (logErr) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: "Server error" });
            }
            db.run("COMMIT");
            db.get("SELECT * FROM products WHERE id = ?", [productId], (getErr, row) => {
              if (getErr || !row) {
                return res.status(500).json({ error: "Server error" });
              }
              res.status(201).json({ product: row });
            });
          }
        );
      }
    );
  });
});

// Update a product. We snapshot the previous record as JSON before updating.
app.put("/admin/api/products/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }
  const { name, description, price, image_url, inventory, archived } = req.body || {};
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }
    const nextName = typeof name === "string" ? name.trim() : existing.name;
    const nextDescription = typeof description === "string" ? description.trim() : existing.description;
    const nextPrice = typeof price === "number" ? price : existing.price;
    const nextImageUrl = typeof image_url === "string" ? image_url : existing.image_url;
    const nextInventory = typeof inventory === "number" ? inventory : existing.inventory;
    const nextArchived = typeof archived === "number" ? archived : existing.archived;
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      const snapshot = JSON.stringify(existing);
      db.run(
        `INSERT INTO product_versions (product_id, snapshot_json)
         VALUES (?, ?)`,
        [existing.id, snapshot],
        versionErr => {
          if (versionErr) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Server error" });
          }
          db.run(
            `UPDATE products
             SET name = ?, description = ?, price = ?, image_url = ?, inventory = ?, archived = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [nextName, nextDescription, nextPrice, nextImageUrl, nextInventory, nextArchived, id],
            updateErr => {
              if (updateErr) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Server error" });
              }
              const diff = {
                before: existing,
                after: {
                  id: existing.id,
                  name: nextName,
                  description: nextDescription,
                  price: nextPrice,
                  image_url: nextImageUrl,
                  inventory: nextInventory,
                  archived: nextArchived
                }
              };
              db.run(
                "INSERT INTO activity_logs (action, product_id, details) VALUES (?, ?, ?)",
                ["update", existing.id, JSON.stringify(diff)],
                logErr => {
                  if (logErr) {
                    db.run("ROLLBACK");
                    return res.status(500).json({ error: "Server error" });
                  }
                  db.run("COMMIT");
                  db.get("SELECT * FROM products WHERE id = ?", [id], (getErr, row) => {
                    if (getErr || !row) {
                      return res.status(500).json({ error: "Server error" });
                    }
                    res.json({ product: row });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});

// Archive (soft delete) a product and log the action.
app.delete("/admin/api/products/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
      db.run(
        "UPDATE products SET archived = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [id],
        updateErr => {
          if (updateErr) {
            db.run("ROLLBACK");
            return res.status(500).json({ error: "Server error" });
          }
          db.run(
            "INSERT INTO activity_logs (action, product_id, details) VALUES (?, ?, ?)",
            ["archive", id, JSON.stringify({ archived: true })],
            logErr => {
              if (logErr) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Server error" });
              }
              db.run("COMMIT");
              res.json({ success: true });
            }
          );
        }
      );
    });
  });
});

// Return version history for one product.
app.get("/admin/api/products/:id/versions", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "Invalid product id" });
  }
  db.all(
    "SELECT * FROM product_versions WHERE product_id = ? ORDER BY created_at DESC",
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      res.json({ versions: rows });
    }
  );
});

// Persist drag-and-drop ordering from the UI.
app.post("/admin/api/products/reorder", requireAdmin, (req, res) => {
  const { orderedIds } = req.body || {};
  if (!Array.isArray(orderedIds) || !orderedIds.every(id => Number.isInteger(id))) {
    return res.status(400).json({ error: "Invalid orderedIds" });
  }
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    let index = 0;
    const updateNext = () => {
      if (index >= orderedIds.length) {
        db.run("COMMIT");
        return res.json({ success: true });
      }
      const id = orderedIds[index];
      db.run("UPDATE products SET sort_order = ? WHERE id = ?", [index, id], err => {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: "Server error" });
        }
        index += 1;
        updateNext();
      });
    };
    updateNext();
  });
});

// Bulk import products from JSON passed by the client.
app.post("/admin/api/products/import", requireAdmin, (req, res) => {
  const { products } = req.body || {};
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: "products must be an array" });
  }
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");
    let index = 0;
    const createdIds = [];
    const insertNext = () => {
      if (index >= products.length) {
        db.run(
          "INSERT INTO activity_logs (action, details) VALUES (?, ?)",
          ["bulk_import", JSON.stringify({ count: createdIds.length })],
          logErr => {
            if (logErr) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: "Server error" });
            }
            db.run("COMMIT");
            res.json({ success: true, createdIds });
          }
        );
        return;
      }
      const p = products[index];
      if (
        !p ||
        typeof p.name !== "string" ||
        typeof p.description !== "string" ||
        typeof p.price !== "number" ||
        typeof p.inventory !== "number"
      ) {
        index += 1;
        insertNext();
        return;
      }
      db.run(
        `INSERT INTO products (name, description, price, image_url, inventory, sort_order, archived)
         VALUES (?, ?, ?, ?, ?, 0, 0)`,
        [p.name.trim(), p.description.trim(), p.price, p.image_url || "", p.inventory],
        function (err) {
          if (!err) {
            createdIds.push(this.lastID);
          }
          index += 1;
          insertNext();
        }
      );
    };
    insertNext();
  });
});

// Export all products as JSON for backup or editing.
app.get("/admin/api/products/export", requireAdmin, (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", 'attachment; filename="products-export.json"');
    res.send(JSON.stringify(rows, null, 2));
  });
});

// Read-only activity feed for the dashboard UI.
app.get("/admin/api/activity", requireAdmin, (req, res) => {
  db.all(
    `SELECT * FROM activity_logs
     ORDER BY created_at DESC
     LIMIT 200`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      res.json({ activity: rows });
    }
  );
});

const backupsDir = path.join(__dirname, "backups");
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

function backupProducts() {
  db.all("SELECT * FROM products", [], (err, products) => {
    if (err) {
      return;
    }
    db.all("SELECT * FROM product_versions", [], (versionsErr, versions) => {
      if (versionsErr) {
        return;
      }
      const snapshot = {
        createdAt: new Date().toISOString(),
        products,
        productVersions: versions
      };
      const fileName = `products-backup-${Date.now()}.json`;
      const filePath = path.join(backupsDir, fileName);
      fs.writeFile(filePath, JSON.stringify(snapshot, null, 2), () => {});
    });
  });
}

const backupIntervalMinutes = parseInt(process.env.BACKUP_INTERVAL_MINUTES || "360", 10);
if (backupIntervalMinutes > 0) {
  setInterval(backupProducts, backupIntervalMinutes * 60 * 1000);
}

app.use(express.static(__dirname));

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

const port = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Admin server listening on port ${port}`);
  });
}

module.exports = app;

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Register endpoint
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    // If user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If login successful
    res.status(200).json({ message: "Login successful", status: 200, name : user.name });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/kegiatan-sholat', async (req, res) => {
  try {
    const { username, sholatName, isChecked, catatan } = req.body;

    // Simpan kegiatan sholat ke database menggunakan Prisma
    const kegiatanSholat = await prisma.kegiatanSholat.create({
      data: {
        username,
        sholatName,
        isChecked,
        catatan,
      },
    });

    res.json({ success: true, data: kegiatanSholat });
  } catch (error) {
    console.error('Error saving kegiatan sholat:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get("/api/catatan-sholat", async (req, res) => {
  try {
    // Ambil catatan sholat dari database
    const catatanSholat = await prisma.kegiatanSholat.findMany();

    // Buat array untuk menyimpan catatan sholat dan informasi isChecked
    const catatanSholatArray = [];
    catatanSholat.forEach((catatan) => {
      catatanSholatArray.push({
        sholatName: catatan.sholatName,
        catatan: catatan.catatan,
        isChecked: catatan.isChecked
      });
    });

    // Kirim respons dengan data catatan sholat
    res.status(200).json(catatanSholatArray);
  } catch (error) {
    console.error("Error fetching catatan sholat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

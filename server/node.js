const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");

/* ========== PERSISTÊNCIA ========== */
function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    saveDB({ users: defaultUsers, messages: [] });
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/* ========== USERS PADRÃO ========== */
const defaultUsers = [
  {
    id: "1",
    name: "Rubens",
    email: "rubens@gmail.com",
    password: "123456",
    avatar: "https://i.ibb.co/67bZV8Sp/7fa29faa7b96.jpg",
    "online": false,
"lastSeen": null,
"typingTo": null
  },
  {
    id: "2",
    name: "Faltante",
    email: "ingrid@gmail.com",
    password: "123456",
    avatar: "https://i.ibb.co/ndHvgh2/dc627ac05a2b.jpg",
    "online": false,
"lastSeen": null,
"typingTo": null
  },
  {
    id: "3",
    name: "Efraim Negreiros",
    email: "efraim@gmail.com",
    password: "123456",
    avatar: "https://i.ibb.co/b5Vzmq07/a3bb19f65225.jpg",
    "online": false,
"lastSeen": null,
"typingTo": null
  },
];

/* ========== USERS ========== */
app.get("/users", (req, res) => {
  const { users } = loadDB();
  res.json(users);
});

/* ========== MESSAGES ========== */
app.get("/messages", (req, res) => {
  const { messages } = loadDB();
  res.json(messages);
});
app.get("/users/:id", (req, res) => {
  const { users } = loadDB();
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
});

app.patch("/users/:id", (req, res) => {
  const db = loadDB();
  const user = db.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  Object.assign(user, req.body);
  saveDB(db);
  res.json(user);
});
app.post("/messages", (req, res) => {
  const db = loadDB();
  const { id, senderId, receiverId, text, createdAt } = req.body;

  const message = {
    id: id || uuid(),
    senderId,
    receiverId,
    text,
    read: false,
    createdAt: createdAt || new Date(),
  };

  db.messages.push(message);
  saveDB(db);
  res.status(201).json(message);
});

app.patch("/messages/:id", (req, res) => {
  const db = loadDB();
  const msg = db.messages.find((m) => m.id === req.params.id);

  if (!msg) return res.status(404).json({ error: "Mensagem não encontrada" });

  Object.assign(msg, req.body);
  saveDB(db);
  res.json(msg);
});

app.delete("/messages/:id", (req, res) => {
  const db = loadDB();
  const index = db.messages.findIndex((m) => m.id === req.params.id);

  if (index === -1) return res.status(404).json({ error: "Não encontrada" });

  db.messages.splice(index, 1);
  saveDB(db);
  res.json({ ok: true });
});

/* ========== START ========== */
app.listen(3001, () => console.log("Server rodando em http://localhost:3001"));

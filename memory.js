// memory.js – מודול זיכרון מתמשך עם תמיכה בהיסטוריית שיחות
const sqlite3 = require('sqlite3');
const path = require('path');

sqlite3.verbose();

// שם הקובץ בתוך התיקייה הנוכחית
const DB_PATH = path.join(__dirname, './agent_memory.db');

const db = new sqlite3.Database(DB_PATH, err => {
  if (err) throw err;
  console.log('🧠 memory.db ready →', DB_PATH);
});

// טבלה לזיכרון כללי
db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS memory_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    role TEXT,
    content TEXT
  )
  `);

  // טבלה חדשה לשמירת שיחות מלאות
  db.run(`
  CREATE TABLE IF NOT EXISTS conversation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    role TEXT,
    content TEXT,
    image_data TEXT
  )
  `);
});

// שמירת זיכרון כללי
function saveMemory(role, content) {
  db.run('INSERT INTO memory_entries (role, content) VALUES (?, ?)', [role, content]);
}

// חיפוש בזיכרון הכללי
function searchMemory(query, limit = 5) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT content FROM memory_entries
       WHERE content LIKE ?
       ORDER BY timestamp DESC
       LIMIT ?`,
      [`%${query}%`, limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows.map(r => r.content));
      }
    );
  });
}

// יצירת מזהה שיחה חדש
function createConversationId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// שמירת הודעה בהיסטוריית השיחות
function saveConversationMessage(conversationId, role, content, imageData = null) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO conversation_history (conversation_id, role, content, image_data) VALUES (?, ?, ?, ?)',
      [conversationId, role, content, imageData],
      function(err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

// קבלת רשימת השיחות הייחודיות
function getConversationsList(limit = 20) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT conversation_id, 
              MAX(timestamp) as last_updated,
              (SELECT content FROM conversation_history WHERE conversation_id = c.conversation_id ORDER BY id ASC LIMIT 1) as first_message
       FROM conversation_history c
       GROUP BY conversation_id
       ORDER BY last_updated DESC
       LIMIT ?`,
      [limit],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

// קבלת הודעות מתוך שיחה מסוימת
function getConversationMessages(conversationId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, timestamp, role, content, image_data
       FROM conversation_history
       WHERE conversation_id = ?
       ORDER BY id ASC`,
      [conversationId],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

// מחיקת שיחה
function deleteConversation(conversationId) {
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM conversation_history WHERE conversation_id = ?',
      [conversationId],
      function(err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });
}

module.exports = {
  saveMemory,
  searchMemory,
  createConversationId,
  saveConversationMessage,
  getConversationsList,
  getConversationMessages,
  deleteConversation
};

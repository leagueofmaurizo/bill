const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const bills = []; // Faturalar bellekte tutuluyor (geliştirilebilir)

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mevcut faturaları getir
app.get('/api/bills', (req, res) => {
  res.json(bills);
});

// Yeni fatura ekle ve herkese bildir
app.post('/api/bills', (req, res) => {
  const bill = req.body;
  bill.id = Date.now() + Math.floor(Math.random() * 10000);
  bills.push(bill);
  io.emit('new-bill', bill);
  res.json({ success: true, bill });
});

// Socket.IO bağlantısı
io.on('connection', (socket) => {
  console.log('Yeni kullanıcı bağlandı');
  socket.on('disconnect', () => {
    console.log('Kullanıcı ayrıldı');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Sunucu çalışıyor: http://localhost:${PORT}`);
});

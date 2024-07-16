const app = require('../app');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
const dotenv = require('dotenv');
dotenv.config({ path: './src/config.env' })

console.log(process.env.NODE_ENV);
const PORT = process.env.PORT;
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('join', (userId) => {
    socket.join(userId);
  });
  socket.on('private message', async (msg) => {
    const { senderId, receiverId, message } = msg;
    try {
      await pool.query('INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)', [senderId, receiverId, message]);
      io.to(receiverId).emit('private message', { senderId, message });
    } catch (err) {
      console.error(err);
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
 });
 
 server.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

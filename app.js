const express = require('express');
const path = require('path')
const app  = express();
const PORT = process.env.PORT || 4000;
const server  = app.listen(PORT,()=> {console.log(`Server on Port ${PORT}`)});

const io = require('socket.io')(server);
app.use(express.static(path.join(__dirname,'public')));

let socketsconnected = new Set();

io.on('connection', onconnected);

function onconnected(socket){
    console.log(socket.id);
    socketsconnected.add(socket.id);

    io.emit('clientstotal', socketsconnected.size)

    socket.on('disconnect', ()=>{
        console.log('Socket Disconnected', socket.id);
        socketsconnected.delete(socket.id);
        io.emit('clientstotal', socketsconnected.size);
    })

    socket.on('message', (data)=>{
        console.log(data);
        socket.broadcast.emit('chatmessage', data)
    })
    socket.on('feedback',(data) =>{
        socket.broadcast.emit('feedback', data)
    })
}
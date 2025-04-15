// Importing required modules
const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const PORT = process.env.PORT || 5001;
var path = require("path");

// Creating an Express application
const app = express();

// Importing user related functions from users.js file
const { addUser, removeUser, getUser } = require('./users');

// Enable Cross-Origin Resource Sharing to allow requests from other origins
app.use(cors());

// Create an HTTP server using the Express app
const server = http.createServer(app);
// Attaching the socket.io to server
const io = socketio(server);

// Loading the index.html page on nodejs render
app.get('/', function(request, response){
    // Calling the static html page to render on browser
    response.sendFile(path.join(__dirname + '/index.html'));
});

// Handling websocket connection
io.on('connect', (socket) =>{
    console.log('connected', socket.id); // logging the connected socketId
    // On user join reading the data and storing it in users array
    socket.on('join', ({name, room}) =>{
        // adding the users in internal variable
        const {error, user} = addUser({id: socket.id, name, room})
        if(error) return error;
        // On initial connection sending welcome message
        socket.emit('message', {user:'admin', text:`${user.name} welcomes you to ${user.room}` })
        // When user join a room Broadcasting it to the all other users connected in the room
        socket.broadcast.to(user.room).emit('message',{user: 'admin', text:`${user.name}, has Joined!`})
        // joining the users to specified room
        socket.join(user.room)
    })

    // handling the send message
    socket.on('sendMessage', (message) =>{
        // fetching user by the socket ID 
        const user = getUser(socket.id);
        // Emitting message to the everyone from the same room
        io.to(user.room).emit('message', {user:user.name, text:message})
    });

    // Handle user diconnecion
    socket.on('disconnect', () =>{

        console.log('user disconnected!', socket.id); // logging the user disconnection
        // Removing the user from the tracking system
        const user = removeUser(socket.id);
        // user left message to rest of the users of room
        if(user){
            socket.to(user.room).emit('message', {user:"admin", "text":`${user.name} has left!`});
        }
    })
})

// starting the server and listening to the port
server.listen(PORT, () =>{
    console.log(`serving on ${PORT}`);
})
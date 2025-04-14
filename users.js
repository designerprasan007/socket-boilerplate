// Initialize an empty array to store user information
const users = [];

/**
 * Adds a new user to the chat system
 * @param {Object} param - An object containing id, room, and name
 * @returns {Object} - Returns either an error or the added user
 */
const addUser = ({id, room, name}) =>{
    // removing the whitespace and trimming the name and room
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // checking is any user with same name present the same room
    const existing = users.find((user) => user.room === room && user.name === name);
    // If any user present returning
    if(existing) return {error:'User Name Already Taken'};
    // creating the user object
    const user = {id, room, name};
    // storing it in the users array
    users.push(user);
    return {user}
}



/**
 * Removes a user from the chat system by their socket id
 * @param {string} id - The id of the user (socket id)
 * @returns {Object|undefined} - Returns the removed user if found
 */
const removeUser = (id) =>{
    // checking is user present in the array with help of socketId
    const index = users.findIndex((user) =>  user.id === id );
    // If user is found removing the user and returning the removed user
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}


/**
 * Retrieves a user by their socket id
 * @param {string} id - The id of the user (socket id)
 * @returns {Object|undefined} - Returns the user object if found
 */
const getUser = (id) => users.find((user ) =>user.id === id);


/**
 * Retrieves all users in a specific room
 * @param {string} room - The name of the room
 * @returns {Array} - Array of user objects in that room
 */
const getUserInRoom = (room) => users.filter((user) => user.room === room)


// Export the user-related utility functions for use in other modules
module.exports = { addUser, removeUser, getUser, getUserInRoom}
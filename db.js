// --------------- Setup ---------------
const sqlite = require ("sqlite3")
const { hashPassword } = require("./utils.js")
const db = new sqlite.Database("database.db")




// --------- Create database table if it doesn't exist ------------
db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY, 
    username TEXT, 
    hashedPassword TEXT,
    CONSTRAINT uniqueUsername UNIQUE(username)
)
`)

// ------------------USERS ----------------



// ----- Save user in db -----
module.exports.registerUser= (username, hashPassword, callback) => {
    const query = `
    INSERT INTO accounts
    (username, hashedPassword)
    VALUES
    (?, ?)
    ` 
    const values = [
        username, 
        hashPassword
    ]
    
    db.run(query, values, callback)
    }
    
    
// ------- Get user from db --------
    exports.getAccountByUsername = function(username, callback) {
        const query = `
        SELECT * FROM accounts WHERE username = ?
        `
        const values = [username]

        db.get(query, values, callback)
    
    }

// ------- Get all users from db -------
module.exports.getAllUsers = (callback) => {
    const query = `
    SELECT * FROM accounts
    `;
    
    
    
    db.all(query, callback)
    }



// ----------------- CARS -------------------
db.run(`
    CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY, 
    make TEXT, 
    model TEXT
)
`)




// ------- Create car in db ---------
module.exports.registerCar= (make, model, callback) => {
    const query = `
    INSERT INTO cars
    (make, model)
    VALUES
    (?, ?)
    `
    const values = [
        make, 
        model
    ]
    
    db.run(query, values, callback)
    }
    
    
    // ---- Get specific car from db ----
    exports.getCar = function(id, callback) {
        const query = `
        SELECT * FROM cars WHERE id = ?
        `
        const values = [id]
        
        db.get(query, values, callback)
    
    }
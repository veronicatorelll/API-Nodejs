// ----------------- Setup -----------------
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// -------- Secret ---------
const JWT_SECRET = "my-secret-key"


// -------- Hash password to save in database -------
module.exports.hashPassword = (password) => {
    const hashValue = bcrypt.hashSync(password, 8)
    return hashValue
}


// ---------- Compare hashed password from db with passoword from request ----------
module.exports.comparePassword = (password, hash) => {
    const correct = bcrypt.compareSync(password, hash)
    return correct
}


// ------------ Create and sign JSON Web Token -----------------
module.exports.getJWTToken = (account) => {
    const userData = {userId: account.id, username: account.username}
    const accessToken = jwt.sign(userData, JWT_SECRET)
    return accessToken
}

// ---------- Verify signature -------------
module.exports.verifyJWT = (token) => {
    return jwt.verify(token, JWT_SECRET)
}

// ------------ Get data ------------------
module.exports.decodeJWT = (token) => {
    return jwt.decode(token, JWT_SECRET)
}

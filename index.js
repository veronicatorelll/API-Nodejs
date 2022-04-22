const express = require('express');
const cars = require('./cars.js')
const users = require('./users.js')
const db = require('./db.js')
const { hashPassword } = require("./utils.js")
const utils = require("./utils.js")




const app = express()
app.use(express.json());




// -------- Get user from token if logged in --------
app.use((req,res, next) => {
    const token = req.headers.authorization

    if (token && utils.verifyJWT(token)) {
        const tokenData = utils.decodeJWT(token)
        req.user = tokenData
        req.user.isLoggedIn = true
    }
    else {
        req.user = {isLoggedIn: false}
    }
    next()
})



// --------- Force login middleware ----------
const forceAuthorize = (req, res, next) => {
    if (req.user.isLoggedIn) {
        next()
    }
    else {
        res.sendStatus(401)
    }
}




// ------ Get id -------
function getId(list){
    const lastItem = list.slice(-1)[0];

    let id = (lastItem?.id)
    id = id ? id+1 : 1;

    return id;
}



// ------------- Start page -----------------
app.get('/', (req, res) => {
    res.send("Start Page")
})



// ------------------ USERS --------------------


// ---------- Register new user ----------
app.post("/register", (req, res) => {
    const {username, password} = req.body
  
    const hashedPassword = utils.hashPassword(password)
  
    db.registerUser(username, hashedPassword, (error) => {
        if(error) {
            console.log(error);
            res.status(500).send(error);
        }
        else {
            res.sendStatus(200) 
        }
    })
  })


  // ------------ Log in user --------------
app.post("/login", (req, res) => {
    const {username, password} = req.body;

    db.getAccountByUsername(username, (error, account) => {
        if(error) {
            res.status(500).send(error);
        } else if (account) {
        const hashedPassword = account.hashedPassword;
        const correctPassword = utils.comparePassword(password, hashedPassword)

        if(correctPassword) {
            const jwtToken = utils.getJWTToken(account)
            res.send(jwtToken)
        }
        else {
            res.sendStatus(404)
        }
        }
        else {
            res.sendStatus(404)
        }
    })
})


// ----------- Demand login to get secrets -------------
app.get("/secrets",forceAuthorize, (req, res) => {
    res.send({
        secretOne: "Using words, you will find, are strange. Mesmerised as they light the flame",
        secretTwo: "Feel the new wind of change, on the wings of the night"
    })
  })

  
// --------- Get all users ----------

app.get('/users', forceAuthorize, (req, res) => {
    db.getAllUsers((error, users) => {
    if (error) {
    console.log(error);
    res.status(500).send(error)
    } else {
    res.send(users)
    }
    })
    })




// --------- Get user by id ---------
app.get("/users/:id", forceAuthorize,  (req, res) => {
const id = parseInt(req.params.id)

const user = users.find(u => u.id === id);

res.send(user)
})


// ----------- Create user -----------
app.post("/users", forceAuthorize, (req, res) => {
    const id = getId(users)

    const newUser = {
        id, 
        name: req.body.name,
        description: req.body.description
    }

    users.push(newUser)

    res.send({id})
})


// --------- Edit user by id ------------
app.put("/users/:id", forceAuthorize, (req, res) => {

    const id = parseInt(req.params.id)

    const user = users.find(u => u.id === id)

    user.name = req.body.name,
    user.description = req.body.description

    res.sendStatus(200)
})


// ----------- Delete user by id -----------
app.delete("/users/:id", forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)

    const index = users.findIndex(u => u.id === id)
    
    users.splice(index, 1)

    res.sendStatus(200)
})





// ---------------- CARS --------------------


// -------- Get all cars --------
app.get('/cars', forceAuthorize, (req, res) => {
    res.send(cars)
})


// -------- Get car by id ---------
app.get('/cars/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)

    const car = cars.find(c => c.id === id)

    res.send(car)
})


// -------- Edit existing car --------
app.put('/cars/:id', forceAuthorize, (req, res) => {
    const id = parseInt(req.params.id)

    const index = cars.findIndex(c => c.id === id)

    cars[index].make = req.body.make
    cars[index].model = req.body.model

    res.sendStatus(200)
})


// ------- Create car --------
app.post('/cars', forceAuthorize, (req, res) => {
    const id = getId(cars)

    const newCar = {
        id,
        make: req.body.make,
        model: req.body.model
    }

    cars.push(newCar)

    res.send({id})
})


// ------ Delete car by id -------
app.delete('/cars/:id', forceAuthorize,  (req, res) => {
    const id = parseInt(req.params.id)

    const index = cars.findIndex(c => c.id === id)

    cars.splice(index, 1)

    res.sendStatus(200)
})



// ------ Listen ------

app.listen(8000, () => {
    console.log("http://localhost:8000/")
})
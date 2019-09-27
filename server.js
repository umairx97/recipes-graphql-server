const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
}

const app = express();
app.use(cors(corsOptions))

// Set up jwt authentication middleware
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== "null") {
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET || "mysecret")
            req.currentUser = currentUser;
        } catch (err) {
            console.log(err.message);

        }
    }
    next();
});


app.use(morgan("dev"))

// GraphQl Imports
const { graphiqlExpress, graphqlExpress } = require("apollo-server-express")
const { makeExecutableSchema } = require('graphql-tools')
const { typeDefs } = require('./schema');
const { resolvers } = require("./resolvers")

// Graphql Schema
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
})

const User = require('./models/User');
const Recipe = require('./models/Recipe');


// Creating Graphql Application
app.use('/graphiql', graphiqlExpress({ endpointURL: "/graphql" }))
app.use('/graphql',
    bodyParser.json(),
    graphqlExpress(({ currentUser }) => ({
        schema,
        context: { User, Recipe, currentUser }
    })))


// DB Connections
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/reactGraphql",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Mongoose open for business"))
    .catch(err => console.error("DATABASE ERROR", err.message))


// Server Config
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(` 🚀  The Server is running on port ${PORT}`)
})
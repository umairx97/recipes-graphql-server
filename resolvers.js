
const jwt = require('jsonwebtoken');

const createToken = (user, secret, expiresIn) => {
    const { username, password } = user
    return jwt.sign({ username, password }, secret, { expiresIn })
}

exports.resolvers = {

    Query: {
        getAllRecipes: async (root, args, { Recipe }) => {
            const allRecipes = await Recipe.find({});
            return allRecipes

        }
    },

    Mutation: {
        // ADD A NEW RECIPE MUTATION
        addRecipe: async (root, { name, category, description, instructions, username }, { Recipe }) => {
            const newRecipe = await new Recipe({
                name,
                category,
                description,
                instructions,
                username,
            }).save()

            return newRecipe

        },

        // UPDATE A RECIPE MUTATION
        updateRecipe: async (root, { name, _id }, { Recipe }) => {
            const updatedRecipe = await Recipe.findByIdAndUpdate(_id, { name })
            return updatedRecipe
        },

        signupUser: async (root, { username, email, password }, { User }) => {
            const userData = await User.findOne({ username });
            if (userData) {
                throw new Error("User is already registered")
            }

            const newUser = await new User({ username, email, password }).save()
            return { token: createToken(newUser, process.env.SECRET || "mysecret", "1hr") }

        }
    }
}
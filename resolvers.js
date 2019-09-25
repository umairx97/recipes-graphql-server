const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

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


        // USER LOGIN
        signinUser: async (root, { username, password }, { User }) => {
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error("User Not Found");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!isPasswordValid) {
                throw new Error("Invalid Password")
            }

            return { token: createToken(user, process.env.SECRET || "mysecret", "1hr") }
        },


        // REGISTER
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
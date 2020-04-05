const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());

// below is for when first starting up to make sure connected
// app.get('/', (req, res, next) => {

//     res.send('Hello World!');

// });

// below the one endpoint for graphql typically named /graphql but could 
// be called /api or what ever
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['Romantic Cooking', 'Sailing', 'All-Night Coding'];
        },
        createEvent: (args) => {
            const eventName = args.name;
            return eventName;
        }
    }, 
    graphiql: true
})
);

app.listen(1337);

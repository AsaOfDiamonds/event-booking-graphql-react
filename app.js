const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');
const User = require('./models/user')

const app = express();

// const events = [];

app.use(bodyParser.json());

// #4 Types & Data

// below is for when first starting up to make sure connected
// app.get('/', (req, res, next) => {

//     res.send('Hello World!');

// });

// below the one endpoint for graphql typically named /graphql but could 
// be called /api or what ever
app.use('/graphql', 
    graphqlHttp({
        schema: buildSchema(`
         type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput {
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            // return events;
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event._doc._id.toString() };
                });
            })
            .catch(err => {
                throw err;
            });
        },
        createEvent: (args) => {
            // const event = {
            //     _id: Math.random().toString(),
            //     title: args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date: args.eventInput.date
            // }
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date)
            });
            // events.push(event);
            return event
            .save()
            .then(result => {
                console.log(result);
                return {...result._doc, _id: event.id};
            })
            .catch(err => {
                console.log(err);
                throw err;
            });
            
        },
        createUser: (args) => {
            const user = new User({
                email: args.userInput.email,
                password: args.userInput.password
            })
        }
    }, 
    graphiql: true
})
);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
    }@cluster0-d7s4s.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority
    `).then(() => {
        app.listen(1337);
    }).catch(err => {
        console.log(err);
    });


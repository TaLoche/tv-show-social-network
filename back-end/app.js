// MODULES

// express framework used in our app
const express = require('express');

// to share resources with the client
const cors = require('cors');

// to create and destroy sessions when user sign in and signs out
const session = require('express-session');

const Server = require('http').Server;

const socket = require('socket.io');

const Review = require('./models/Review');

const Chatmessage = require('./models/Chatmessage');


// DATABASE CONNECTION

// connection information
const db = require('./config/database');

// DB connection
db.authenticate()
  .then(() => console.log('Connexion à la base de données réussie'))
  .catch(err => console.log(err));

// express is called to create our app
const app = express();
const server = Server(app);
const io = socket(server);
const port = process.env.PORT || 5000;



// MIDDLEWARES

app.use(session({
  secret: 'serialkillerbestproject',
  resave: false,
  saveUninitialized: false,
}));
app.use(cors());
// body-parser n'est plus nécessaire pour parser les informations en JSON,
// on peut directement utiliser express :
app.use(express.json());



// ROUTES & API

// Routers are required
const usersRouter = require('./routes/users');
const genresRouter = require('./routes/genres');
const showsRouter = require('./routes/shows');
const directorsRouter = require('./routes/directors');
const actorsRouter = require('./routes/actors');
const reviewsRouter = require('./routes/reviews');
const messagesRouter = require('./routes/chatmessages')

// APIs associated with each Router (and routes included)
app.use('/users', usersRouter);
app.use('/genres', genresRouter);
app.use('/shows', showsRouter);
app.use('/directors', directorsRouter);
app.use('/actors', actorsRouter);
app.use('/reviews', reviewsRouter);
app.use('/messages', messagesRouter);



// SOCKET.IO

let chatmessageIdToIncrement = 0;
let reviewIdToIncrement = 0;

io.on('connection', (socket) => {
  console.log('>> socket.io - connected');
  
  // to avoid duplicates between websocket and db chatmessage ids
  Chatmessage.findAll()
  .then((messages) => {
    chatmessageIdToIncrement = Math.max(...messages.map(oneMessage => oneMessage.id)); 
  });  

  socket.on('send_message', (message) => {
    message.id = ++chatmessageIdToIncrement;
    io.emit('send_message', message);
  });

  // to avoid duplicates between websocket and db review ids
  Review.findAll()
  .then((reviews) => {
    reviewIdToIncrement = Math.max(...reviews.map(oneReview => oneReview.id));
  });

  socket.on('post_review', (review) => {
    review.id = ++reviewIdToIncrement;
    io.emit('post_review', review); 
  });
})



// PORT

server.listen(port, () => {
    console.log(`Le serveur tourne sur le port : ${port}`);
});
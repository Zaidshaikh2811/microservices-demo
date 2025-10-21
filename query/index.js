import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const posts = {};

// Handle incoming events
const handleEvent = (type, data) => {
    console.log("Received: " + type);

    if (type === 'PostCreated') {
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId } = data;
        const post = posts[postId];
        if (post) {
            post.comments.push({ id, content });
        }
    }
};

// Get all posts (structured data)
app.get('/posts', (req, res) => {
    res.send(posts);
});

// Receive events from Event Bus
app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log("Received Event on 4002:", type);

    handleEvent(type, data);
    res.send({});
});

app.listen(4002, async () => {
    console.log('Query Service running on 4002');

    try {
        const res = await axios.get('http://event-bus-srv:4005/events');
        for (let event of res.data) {
            console.log('Processing event:', event.type);
            handleEvent(event.type, event.data);
        }
    } catch (err) {
        console.log('Error fetching events', err.message);

    }
});

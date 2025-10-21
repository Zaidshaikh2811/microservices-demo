import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async (req, res) => {
    const id = Date.now().toString();
    const { title } = req.body;
    const post = { id, title };
    posts[id] = post;


    // emit event to Event Bus
    try {
        await fetch('http://event-bus-srv:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: 'PostCreated',
                data: post
            })
        });
        res.status(201).send(post);
    } catch (err) {
        console.error('Error sending PostCreated event', err.message);
        res.status(500).send({ error: 'Failed to emit event' });
        return;
    }


});

// Receive events from the Event Bus (we log them)
app.post('/events', (req, res) => {
    console.log('Posts service received event:', req.body.type);
    // if we needed to react to events, handle them here
    res.send({});
});

app.listen(4000, () => {
    console.log('Posts service v20 listening on 4000');
});

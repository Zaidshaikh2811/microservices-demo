import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}; // { postId: [ { id, content, status } ] }

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts', async (req, res) => {
    const commentId = Date.now().toString();
    const { content, postId } = req.body;
    const comment = { id: commentId, content, status: 'pending' };

    const comments = commentsByPostId[postId] || [];
    comments.push(comment);
    commentsByPostId[postId] = comments;


    const event = {
        type: 'CommentCreated',
        data: { id: commentId, content, status: 'pending', postId },
    };

    // emit CommentCreated event to Event Bus
    try {
        await fetch('http://event-bus-srv:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(event),
        });
        res.status(201).send(comment);
    } catch (err) {
        console.error('Error sending CommentCreated event', err.message);
        res.status(500).send({ error: 'Failed to emit event' });
        return;
    }


});

// Receive events from Event Bus
app.post('/events', async (req, res) => {
    const { type, data } = req.body;
    console.log('Comments service received event:', type);

    // Example: react to moderation events (if you add a moderator service later)
    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];
        if (!comments) return res.send({});

        const comment = comments.find(c => c.id === id);
        if (comment) {
            comment.status = status;

            // emit CommentUpdated event
            try {
                await fetch('http://event-bus-srv:4005/events', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'CommentUpdated',
                        data: { id, postId, status, content }
                    })
                });
            } catch (err) {
                console.error('Error sending CommentUpdated event', err.message);
            }
        }
    }

    res.send({});
});

app.listen(4001, () => {
    console.log('Comments service listening on 4001');
});

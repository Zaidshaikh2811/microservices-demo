import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = []; // in-memory store

app.post('/events', async (req, res) => {
    const event = req.body;
    events.push(event);
    console.log("Received Event  on Event Bus:", event.type);

    const services = [
        'http://posts-clusterip-srv:4000/events',
        'http://comments-srv:4001/events',
        'http://query-srv:4002/events'
    ];

    for (const svc of services) {
        try {
            await fetch(svc, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });

        } catch (err) {
            console.error(`Failed to forward to ${svc}:`, err.message);

        }

    }

    res.send({ status: 'OK' });
});

// helpful endpoint to inspect all events
app.get('/events', (req, res) => {
    res.send(events);
});



app.listen(4005, () => {
    console.log('Event Bus listening on port 4005');
});
import { createClient } from 'redis';

const client = createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    user: 'apiworker',
    password: process.env.REDIS_PASSWORD
});

export default client;

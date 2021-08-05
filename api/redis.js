import redis from 'redis';

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
});

export default client;

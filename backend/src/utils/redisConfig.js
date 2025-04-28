import Redis from 'ioredis';


const redisClient = new Redis({
  host: 'localhost', 
  port: 6379,        
  password: 'redis-password', 
  db: 0,
});

redisClient.on('connect', () => {
  console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
  // console.error('Redis error:', err);
});

export default redisClient ;

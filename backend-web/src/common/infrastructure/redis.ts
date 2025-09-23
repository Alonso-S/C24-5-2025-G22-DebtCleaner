import Redis from "ioredis";

const redis = new Redis(); // por defecto se conecta a localhost:6379

export default redis;

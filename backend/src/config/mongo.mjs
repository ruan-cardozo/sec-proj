import mongoose from "mongoose";
import { _log } from "../common/helper/logger.mjs";

const MONGO_URI= `mongodb://root:example@mongo:27017/cyber-sec-database?retryWrites=true&loadBalanced=false&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1`;

export class MongoDB {

    constructor() {
        this.connection = null;
    }
    
    static #instance;

    static getInstance() {
            
            if (!MongoDB.#instance) {
    
                MongoDB.#instance = new MongoDB();
            }
    
            return MongoDB.#instance
    }

    async connect() {
        if (!this.connection) {
            const uri = MONGO_URI;
            try {
                this.connection = await mongoose.connect(uri);
                _log('Connected to MongoDB');
            } catch (error) {
                console.error('Error connecting to MongoDB', error);
                throw error;
            }
        }
        return this.connection;
    }

    async disconnect() {
        if (this.connection) {
            await mongoose.connection.close();
            this.connection = null;
            _log('Disconnected from MongoDB');
        }
    }
}
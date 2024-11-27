import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { config } from './config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    //won't use in  production
    //use for development
    synchronize: config.NODE_ENV === 'development' || config.NODE_ENV === 'test',
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: []
})

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entity/User'
import { RefreshToken } from '../entity/RefreshToken'
import { config } from './config'

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [User, RefreshToken],
    migrations: ['src/migrations/*.ts'],
    subscribers: []
})

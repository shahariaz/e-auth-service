import dotenvFlow from 'dotenv-flow'
import path from 'path'

// Configure dotenv-flow with correct path
dotenvFlow.config({
    path: path.resolve(process.cwd()),
    node_env: process.env.NODE_ENV || 'development'
})
class Config {
    public PORT: number | undefined
    public NODE_ENV: string | undefined
    public DB_PORT: number | undefined
    public DB_HOST: string | undefined
    public DB_USER: string | undefined
    public DB_PASSWORD: string | undefined
    public DB_NAME: string | undefined
    public SECRET_KEY: string | undefined
    public JWKS_URI: string | undefined
    public private_key: string | undefined
    constructor() {
        this.PORT = parseInt(process.env.PORT as string)
        this.NODE_ENV = process.env.NODE_ENV
        this.DB_PORT = parseInt(process.env.DB_PORT as string)
        this.DB_HOST = process.env.DB_HOST
        this.DB_USER = process.env.DB_USER
        this.DB_PASSWORD = process.env.DB_PASSWORD
        this.DB_NAME = process.env.DB_NAME
        this.SECRET_KEY = process.env.SECRET_KEY
        this.JWKS_URI = process.env.JWKS_URI
        this.private_key = process.env.PRIVATE_KEY
        this.validateConfig()
    }
    public validateConfig(): void {
        for (const [key, value] of Object.entries(this)) {
            if (value === undefined || value === null) {
                throw new Error(`Environment variable ${key} is missing`)
            }
        }
    }
}
export const config: Config = new Config()

import dotenvflow from 'dotenv-flow'
dotenvflow.config()
class Config {
    public DATABASE_URL: string | undefined
    public PORT: number | undefined
    constructor() {
        this.DATABASE_URL = process.env.DATABASE_URL
        this.PORT = parseInt(process.env.PORT as string)
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

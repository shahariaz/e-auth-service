import { config } from './config/config'
import app from './app'
import logger from './config/logger'
const startServer = () => {
    const port = config.PORT
    try {
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`)
        })
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error occurred: ${error.message}`)
        } else {
            logger.error('An unknown error occurred')
            process.exit(1)
        }
    }
}

startServer()

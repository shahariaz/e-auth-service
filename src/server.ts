import { config } from './config/config'
import app from './app'
import logger from './config/logger'

import { AppDataSource } from './config/data-source'
;(() => {
    const port = config.PORT

    AppDataSource.initialize()
        .then(() => {
            logger.info('Database connection established successfully')
            app.listen(port, () => {
                logger.info(`Server is running on port ${port}`)
            })
        })
        .catch((error) => {
            if (error instanceof Error) {
                logger.error(`Error occurred: ${error.message}`)
            } else {
                logger.error('An unknown error occurred')
                process.exit(1)
            }
        })
})()

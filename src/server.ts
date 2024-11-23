import { config } from './config/config'
import app from './app'
const startServer = () => {
    const port = config.PORT
    try {
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server is running on port ${port}`)
        })
    } catch (error) {
        if (error instanceof Error) {
            // eslint-disable-next-line no-console
            console.error(`Error occurred: ${error.message}`)
        } else {
            // eslint-disable-next-line no-console
            console.error('An unknown error occurred')
            process.exit(1)
        }
    }
}
startServer()

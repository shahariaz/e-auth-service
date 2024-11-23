export default {
    SUCCESS: `The operation was successful`,
    ERROR: `An error occurred`,
    WARNING: `Warning: This operation could potentially harm your data`,
    INFO: `This operation is being performed`,
    DEBUG: `This operation is being performed for debugging purposes`,
    LOGOUT: `You have been logged out`,
    LOGIN: `You have been logged in`,
    REGISTER: `You have been registered`,
    UNAUTHORIZED: `Unauthorized access`,
    FORBIDDEN: `Access denied`,
    NOT_FOUND: (entity: string) => `${entity} not found`,
    BAD_REQUEST: `Bad request`,
    INTERNAL_SERVER_ERROR: `Internal server error`,
    SERVICE_UNAVAILABLE: `Service unavailable`
}

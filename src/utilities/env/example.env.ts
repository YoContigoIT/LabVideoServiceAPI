import enviroment from "./env.interface";

export default {
    http: {
        host: process.env.HTTP_HOST_IP || '',
        port: process.env.HTTP_HOST_PORT || 3000
    },
    db: {
        mysql: {
            username: process.env.DB_MYSQL_USERNAME || "",
            password:process.env.DB_MYSQL_PASSWORD || "",
            host: process.env.DB_MYSQL_HOST || '',
            port: process.env.DB_MYSQL_PORT || 8889,
            database: process.env.DB_MYSQL_DB_NAME || ""
        }
    },
    ws: {
        port: '',
        apiRoomName: ''
    },

    logger: {
        level: ''
    },

    jwt: {
        secret_key: process.env.JWT_SECRET || "",
        expiration_time: process.env.JWT_EXPIRATION_TIME || ""
    },

    openVidu: {
        host: process.env.OPEN_VIDU_HOST || "http://localhost",
        port: process.env.OPEN_VIDU_PORT || 4443,
        secret: process.env.OPEN_VIDU_SECRET || '',
    }
} as enviroment;
export default class {
    http: {
        host: string;
        port: string | number;
    };
    db: {
        mysql: {
            username: string;
            password: string;
            host: string;
            port: number | string;
            database: string;
        };
    };
    ws: {
        port: string;
        apiRoomName: string;
    };
    logger: {
        level: string;
    };
    jwt: {
        secret_key: string;
        expiration_time: string;
    };
    openVidu: {
        host: string;
        port: number | string;
        secret: string;
        recordingPath: string;

        ssh: {
            host:string;
            port: string | number;
            username: string;
            passphrase: string;
            secretKeyDir: string;
        }
    };
    aws: {
        region: string;
        s3: {
            bucket: string;
        }
    }
}
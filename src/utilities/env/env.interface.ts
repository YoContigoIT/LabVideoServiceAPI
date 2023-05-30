export class MySQLConnection {
    username: string;
    password: string;
    host: string;
    port: number | string;
    database: string;
}

export default class {
    http: {
        host: string;
        port: string | number;
    };
    db: {
        mysql: {
            useReplication: boolean;
            unique?: MySQLConnection,
            replication?: {
                master: MySQLConnection,
                slaves: MySQLConnection[]
            }
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
            uploadBucket: string;
        }
    }
}
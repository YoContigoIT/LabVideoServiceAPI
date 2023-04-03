import { ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectRequest, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { Client } from 'ssh2';

@Injectable()
export class AwsService {
    s3Client: S3Client;
    uploadParams: PutObjectCommandInput;
    
    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get<string>('aws.region'),
        });

        this.uploadParams = {
            Bucket: this.configService.get<string>('aws.s3.bucket'),
            Key: ''
        }
    }

    async sendObjectToS3(fileName: string, object: PutObjectCommandInput["Body"], ...params: any[] ) {
        const uploadParams = {
            ...this.uploadParams,
            Key: fileName,
            Body: object,
            ...params
        }

        try {            
            const data = await this.s3Client.send(new PutObjectCommand(uploadParams));
            // console.log('AWS S3 Success', data);

            return data;
        } catch (err) {
            console.error("AWS_S3_PUT_Object_Error", err);
        }

    }

    getSignedURL(key: string) {
        const bucketParams = {
            ...this.uploadParams,
            Key: key
        }
        
        try {
            const command = new GetObjectCommand(bucketParams);

            return getSignedUrl(this.s3Client, command, { expiresIn: 3600 })
        } catch(error) {
            console.error(error);
        }
    }

    async deleteObject(key: string) {
        const bucketParams = {
            ...this.uploadParams,
            Key: key
        }
        
        try {
            return await this.s3Client.send(new DeleteObjectCommand(bucketParams))
        } catch(error) {
            console.error(error);
        }
    }

    async listBucketObjects() {
        try {
            const input = { // ListObjectsV2Request
                Bucket: this.configService.get<string>('aws.s3.bucket'), // required
                // Delimiter: "STRING_VALUE",
                // EncodingType: "url",
                // MaxKeys: Number("int"),
                // Prefix: "STRING_VALUE",
                // ContinuationToken: "STRING_VALUE",
                // FetchOwner: true || false,
                // StartAfter: "STRING_VALUE",
                // RequestPayer: "requester",
                // ExpectedBucketOwner: "STRING_VALUE",
            };            

            return await this.s3Client.send(new ListObjectsV2Command(input))
        } catch (err) {
            console.warn(err);
        }
    }

    exectPutObjectCommandInEC2Instance(fileName: string, key: string) {
        
        try {
            const connection = new Client();
            connection.on('ready', () => {
                // console.log('Connection :: ready');
                connection.shell((err, stream) => {
                    if (err) throw err;
                    
                    stream
                    .on('close', () => {
                    //   console.log('Connection :: close');
                      connection.end();
                    })
                    .on('data', (data) => {
                    //   console.log('OUTPUT: ' + data);
                    });
                    
                    stream.end(
                        `
                            sh /opt/openvidu/push_recording_s3.sh -n ${fileName} -k ${key} -b ${this.configService.get<string>('aws.s3.bucket')}\n
                            exit\n
                        `
                    );
                });
            }).connect({
                host: this.configService.get<string>('openVidu.ssh.host'),
                port: this.configService.get<number>('openVidu.ssh.port'),
                username: this.configService.get<string>('openVidu.ssh.username'),
                passphrase: this.configService.get<string>('openVidu.ssh.passphrase'),
                privateKey: readFileSync(`certs/${this.configService.get<string>('openVidu.ssh.secretKeyDir')}`),
            })
        } catch (err) {
            console.warn(err);
        }
    }
}

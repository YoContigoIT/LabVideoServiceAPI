import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, PutObjectCommandInput, PutObjectRequest, S3, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


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
            console.log('AWS S3 Success', data);

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
}

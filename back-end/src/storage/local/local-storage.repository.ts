import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import { StorageRepository } from '../storage.repository';

dotenv.config();

@Injectable()
export class LocalStorageRepository implements StorageRepository {
  private s3: S3Client;
  private bucketName: string;

  constructor() {
    this.s3 = new S3Client({
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY || 'admin',
        secretAccessKey: process.env.MINIO_SECRET_KEY || 'password',
      },
    });
    this.bucketName = process.env.MINIO_BUCKET || 'local-bucket';
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          Body: fileBuffer,
          ContentType: contentType,
        }),
      );
      return { url: `http://localhost:9000/${this.bucketName}/${fileName}` };
    } catch (error) {
      throw new Error(`MinIO Upload failed: ${error}`);
    }
  }

  async deleteFile(fileUrl: string) {
    const fileName = fileUrl.split('/').pop();

    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
        }),
      );
      return { success: true };
    } catch (error) {
      throw new Error(`MinIO Delete failed: ${error}`);
    }
  }

  async listFiles() {
    try {
      const { Contents } = await this.s3.send(
        new ListObjectsV2Command({
          Bucket: this.bucketName,
        }),
      );
      return (
        Contents?.map((file) => ({
          name: file.Key || '',
          url: `http://localhost:9000/${this.bucketName}/${file.Key}`,
        })) || []
      );
    } catch (error) {
      throw new Error(`MinIO List failed: ${error}`);
    }
  }
}

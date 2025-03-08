/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { put, del, list } from '@vercel/blob';
import { StorageRepository } from '../storage.repository';

@Injectable()
export class VercelBlobStorageRepository implements StorageRepository {
  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    try {
      const result = await put(fileName, fileBuffer, {
        contentType,
        access: 'public',
      });
      return { url: result.url };
    } catch (error) {
      throw new Error(`Vercel Blob Upload failed: ${error}`);
    }
  }

  async deleteFile(fileUrl: string): Promise<{ success: boolean }> {
    try {
      await del(fileUrl);
      return { success: true };
    } catch (error) {
      throw new Error(`Vercel Blob Delete failed: ${error}`);
    }
  }

  async listFiles(): Promise<{ name: string; url: string }[]> {
    try {
      const result = await list();
      return result.blobs.map((blob) => ({
        name: blob.pathname,
        url: blob.url,
      }));
    } catch (error) {
      throw new Error(`Vercel Blob List failed: ${error}`);
    }
  }
}

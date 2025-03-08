import { Injectable } from '@nestjs/common';
import { StorageRepository } from './storage.repository';
import { LocalStorageRepository } from './local/local-storage.repository';
import { VercelBlobStorageRepository } from './vercel/vercel-blob-storage.repository';

@Injectable()
export class StorageService {
  private storage: StorageRepository;

  constructor(
    private readonly localStorageRepository: LocalStorageRepository,
    private readonly vercelBlobStorageRepository: VercelBlobStorageRepository,
  ) {
    this.storage =
      process.env.USE_MINIO === 'true'
        ? this.localStorageRepository
        : this.vercelBlobStorageRepository;
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, contentType: string) {
    return this.storage.uploadFile(fileBuffer, fileName, contentType);
  }

  async deleteFile(fileUrl: string) {
    return this.storage.deleteFile(fileUrl);
  }

  async listFiles() {
    return this.storage.listFiles();
  }
}

import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { LocalStorageRepository } from './local/local-storage.repository';
import { VercelBlobStorageRepository } from './vercel/vercel-blob-storage.repository';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [
    StorageService,
    LocalStorageRepository,
    VercelBlobStorageRepository,
  ],
  exports: [StorageService],
})
export class StorageModule {}

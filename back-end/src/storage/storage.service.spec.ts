/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { StorageRepository } from './storage.repository';
import { StorageService } from './storage.service';
import { VercelBlobStorageRepository } from './vercel/vercel-blob-storage.repository';
import { LocalStorageRepository } from './local/local-storage.repository';

describe('StorageService (Vercel Blob Only)', () => {
  let service: StorageService;
  let storageRepository: jest.Mocked<StorageRepository>;

  beforeEach(async () => {
    storageRepository = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
      listFiles: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StorageService,
        {
          provide: LocalStorageRepository,
          useValue: {},
        },
        {
          provide: VercelBlobStorageRepository,
          useValue: storageRepository,
        },
      ],
    }).compile();

    service = module.get<StorageService>(StorageService);

    (service as any).storage = storageRepository;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file to Vercel Blob and return metadata', async () => {
      const mockResponse = { url: 'https://vercel-storage.com/testfile.jpg' };
      storageRepository.uploadFile.mockResolvedValue(mockResponse);

      const result = await service.uploadFile(
        Buffer.from('test-data'),
        'testfile.jpg',
        'image/jpeg',
      );

      expect(storageRepository.uploadFile).toHaveBeenCalledWith(
        expect.any(Buffer),
        'testfile.jpg',
        'image/jpeg',
      );
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if Vercel Blob upload fails', async () => {
      storageRepository.uploadFile.mockRejectedValue(
        new Error('Upload failed'),
      );

      await expect(
        service.uploadFile(
          Buffer.from('test-data'),
          'testfile.jpg',
          'image/jpeg',
        ),
      ).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteFile', () => {
    it('should delete a file from Vercel Blob', async () => {
      storageRepository.deleteFile.mockResolvedValue({ success: true });

      const result = await service.deleteFile(
        'https://vercel-storage.com/testfile.jpg',
      );

      expect(storageRepository.deleteFile).toHaveBeenCalledWith(
        'https://vercel-storage.com/testfile.jpg',
      );
      expect(result).toEqual({ success: true });
    });

    it('should throw an error if delete fails', async () => {
      storageRepository.deleteFile.mockRejectedValue(
        new Error('Delete failed'),
      );

      await expect(
        service.deleteFile('https://vercel-storage.com/testfile.jpg'),
      ).rejects.toThrow('Delete failed');
    });
  });

  describe('listFiles', () => {
    it('should list files from Vercel Blob', async () => {
      const mockResponse = [
        {
          name: 'testfile.jpg',
          url: 'https://vercel-storage.com/testfile.jpg',
        },
      ];
      storageRepository.listFiles.mockResolvedValue(mockResponse);

      const result = await service.listFiles();

      expect(storageRepository.listFiles).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw an error if list fails', async () => {
      storageRepository.listFiles.mockRejectedValue(new Error('List failed'));

      await expect(service.listFiles()).rejects.toThrow('List failed');
    });
  });
});

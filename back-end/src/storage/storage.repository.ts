export interface StorageRepository {
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
  ): Promise<{ url: string }>;
  deleteFile(fileUrl: string): Promise<{ success: boolean }>;
  listFiles(): Promise<{ name: string; url: string }[]>;
}

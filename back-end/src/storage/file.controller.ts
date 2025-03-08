import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('File')
@Controller('file')
export class FileController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a file',
    description: 'Uploads a file and returns its URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload payload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'File successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - invalid file or no file uploaded',
  })
  async uploadFile(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const fileBuffer = file.buffer;
    const fileName = file.originalname;
    const fileMimeType = file.mimetype;

    if (!(fileBuffer instanceof Buffer)) {
      throw new BadRequestException('Invalid file buffer');
    }

    if (typeof fileName !== 'string' || typeof fileMimeType !== 'string') {
      throw new BadRequestException('Invalid file metadata');
    }

    const uploadedFile = await this.storageService.uploadFile(
      fileBuffer,
      fileName,
      fileMimeType,
    );

    return { url: uploadedFile.url };
  }
}

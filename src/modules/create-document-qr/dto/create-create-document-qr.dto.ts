import { Body } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class FileData {
  @ApiProperty()
  template: string;

  @ApiProperty()
  data: any;
}

export class BodyContent {
  bodycap: string;
}

export class BufferResponse {
  dataBuffer: Buffer;
  dataBase64: string;
}

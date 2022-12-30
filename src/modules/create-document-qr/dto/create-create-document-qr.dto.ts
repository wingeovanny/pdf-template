import { ApiProperty } from '@nestjs/swagger';

export class FileData {
  @ApiProperty()
  template: string;

  @ApiProperty()
  data: dataTemplate[];
}

export class contenidoHt {
  bodycap: string;
}

export interface dataTemplate {
  branch: string;
  sitebranch: string;
  codesite: string;
  coderedmainsite: string;
  qr: string;
}

export class BufferResponse {
  dataBuffer: Buffer;
  dataBase64: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class FileData {
    @ApiProperty()
    template: string;

    @ApiProperty()
    data: any;
}


export class BufferResponse {
    dataBuffer: Buffer;
    dataBase64: string;
}
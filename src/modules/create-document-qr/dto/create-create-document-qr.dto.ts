import { ApiProperty } from '@nestjs/swagger';

export class FileData {
    @ApiProperty()
    template: string;

    @ApiProperty()
    data: object;
}

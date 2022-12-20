import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDocumentQrService } from './create-document-qr.service';
import { CreateCreateDocumentQrDto } from './dto/create-create-document-qr.dto';
import { UpdateCreateDocumentQrDto } from './dto/update-create-document-qr.dto';

@Controller('create-document-qr')
export class CreateDocumentQrController {
  constructor(private readonly createDocumentQrService: CreateDocumentQrService) {}

  @Post()
  create(@Body() createCreateDocumentQrDto: CreateCreateDocumentQrDto) {
    return this.createDocumentQrService.create(createCreateDocumentQrDto);
  }

  @Get()
  findAll() {
    return this.createDocumentQrService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createDocumentQrService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreateDocumentQrDto: UpdateCreateDocumentQrDto) {
    return this.createDocumentQrService.update(+id, updateCreateDocumentQrDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.createDocumentQrService.remove(+id);
  }
}

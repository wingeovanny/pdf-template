import { Injectable } from '@nestjs/common';
import { CreateCreateDocumentQrDto } from './dto/create-create-document-qr.dto';
import { UpdateCreateDocumentQrDto } from './dto/update-create-document-qr.dto';

@Injectable()
export class CreateDocumentQrService {
  create(createCreateDocumentQrDto: CreateCreateDocumentQrDto) {
    return 'This action adds a new createDocumentQr';
  }

  findAll() {
    return `This action returns all createDocumentQr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} createDocumentQr`;
  }

  update(id: number, updateCreateDocumentQrDto: UpdateCreateDocumentQrDto) {
    return `This action updates a #${id} createDocumentQr`;
  }

  remove(id: number) {
    return `This action removes a #${id} createDocumentQr`;
  }
}

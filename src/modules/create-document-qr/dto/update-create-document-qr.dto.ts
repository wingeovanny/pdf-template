import { PartialType } from '@nestjs/mapped-types';
import { CreateCreateDocumentQrDto } from './create-create-document-qr.dto';

export class UpdateCreateDocumentQrDto extends PartialType(CreateCreateDocumentQrDto) {}

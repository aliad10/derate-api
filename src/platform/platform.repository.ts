import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../database/database.repository';
import { Platform, PlatformDocument } from './schemas';
@Injectable()
export class PlatformRepository extends EntityRepository<PlatformDocument> {
  constructor(
    @InjectModel(Platform.name)
    platformModel: Model<PlatformDocument>
  ) {
    super(platformModel);
  }
}

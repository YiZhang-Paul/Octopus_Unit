import { Container } from 'inversify';

import ILogger from '../interface/io/logger.interface';
import IFileService from '../interface/io/file/file-service.interface';
import IDirectoryService from '../interface/io/directory/directory-service.interface';
import Logger from '../service/io/logger';
import FileService from '../service/io/file-service/file-service';
import DirectoryService from '../service/io/directory-service/directory-service';

import Types from './types';

const container = new Container();

container
    .bind<ILogger>(Types.ILogger)
    .to(Logger)
    .inSingletonScope();

container
    .bind<IFileService>(Types.IFileService)
    .to(FileService)
    .inSingletonScope();

container
    .bind<IDirectoryService>(Types.IDirectoryService)
    .to(DirectoryService)
    .inSingletonScope();

export default container;

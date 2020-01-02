import { Container } from 'inversify';

import ILogger from '../services/interfaces/logger.interface';
import IFileService from '../services/interfaces/file-service.interface';
import IDirectoryService from '../services/interfaces/directory-service.interface';
import IDirectoryViewerService from '../services/interfaces/directory-viewer-service.interface';
import Logger from '../services/io/logger';
import FileService from '../services/io/file-service/file-service';
import DirectoryService from '../services/io/directory-service/directory-service';
import DirectoryViewerService from '../services/viewers/directory-viewer-service/directory-viewer-service';

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

container
    .bind<IDirectoryViewerService>(Types.IDirectoryViewerService)
    .to(DirectoryViewerService)
    .inSingletonScope();

export default container;

import { inject, injectable } from 'inversify';
import * as pathService from 'path';

import Types from '../../../ioc/types';
import IFileNode from '../../interfaces/file-node.interface';
import IDirectoryService from '../../interfaces/directory-service.interface';
import IDirectoryViewerService from '../../interfaces/directory-viewer-service.interface';

const { IDirectoryService: IDirectoryServiceKey } = Types;

@injectable()
export default class DirectoryViewerService implements IDirectoryViewerService {

    constructor(@inject(IDirectoryServiceKey) private _directoryService: IDirectoryService) { }

    public async listDirectoryRecursive(path: string): Promise<IFileNode[]> {
        const fileNames = await this._directoryService.listDirectory(path);

        return Promise.all(fileNames.map(async name => {
            const fullPath = pathService.join(path, name);
            const isDirectory = await this._directoryService.isDirectory(fullPath);
            const children = isDirectory ? await this.listDirectoryRecursive(fullPath) : null;

            return ({ name, children } as IFileNode);
        }));
    }
}

import * as pathService from 'path';

import IFileNode from '../interfaces/file-node.interface';
import IDirectoryService from '../interfaces/directory-service.interface';

export default class DirectoryViewerService {

    constructor(private _directoryService: IDirectoryService) { }

    public async listDirectoryRecursive(path: string): Promise<IFileNode[]> {
        const names = await this._directoryService.listDirectory(path);

        return Promise.all(names.map(async name => {
            const fullPath = pathService.join(path, name);
            const isDirectory = await this._directoryService.isDirectory(fullPath);
            const children = isDirectory ? await this.listDirectoryRecursive(fullPath) : null;

            return ({ name, children } as IFileNode);
        }));
    }
}

import { injectable } from 'inversify';
import * as pathService from 'path';
import * as fs from 'fs';

import Types from '../../../ioc/types';
import Container from '../../../ioc/container';
import IFileNode from '../../../interface/io/file/file-node.interface';
import ILogger from '../../../interface/io/logger.interface';
import IDirectoryService from '../../../interface/io/directory/directory-service.interface';

@injectable()
export default class DirectoryService implements IDirectoryService {

    private _logger = Container.get<ILogger>(Types.ILogger);

    public async listDirectoryFlat(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error: any, fileNames: string[]) => {
                if (error) {
                    this._logger.log(error);
                }
                error ? reject([]) : resolve(fileNames);
            });
        });
    }

    public async listDirectoryRecursive(path: string): Promise<IFileNode[]> {
        const fileNames = await this.listDirectoryFlat(path);

        return Promise.all(fileNames.map(async name => {
            const fullPath = pathService.join(path, name);
            const isDirectory = await this.isDirectory(fullPath);
            const children = isDirectory ? await this.listDirectoryRecursive(fullPath) : null;

            return ({ name, children } as IFileNode);
        }));
    }

    public async isDirectory(path: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.lstat(path, (error: any, stats: fs.Stats) => {
                if (error) {
                    this._logger.log(error);
                }
                resolve(error ? false : stats.isDirectory());
            });
        });
    }
}

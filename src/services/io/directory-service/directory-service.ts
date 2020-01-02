import { inject } from 'inversify';
import * as fs from 'fs';

import Types from '../../../ioc/types';
import ILogger from '../../interfaces/logger.interface';
import IDirectoryService from '../../interfaces/directory-service.interface';

export default class DirectoryService implements IDirectoryService {

    constructor(@inject(Types.ILogger) private _logger: ILogger) { }

    public async listDirectory(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error: any, fileNames: string[]) => {
                if (error) {
                    this._logger.log(error);
                }
                error ? reject([]) : resolve(fileNames);
            });
        });
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

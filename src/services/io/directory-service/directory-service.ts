import * as fs from 'fs';

import Logger from '../logger';
import IDirectoryService from '../../interfaces/directory-service.interface';

export default class DirectoryService implements IDirectoryService {

    public async listDirectory(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error: any, fileNames: string[]) => {
                if (error) {
                    Logger.log(error);
                }
                error ? reject([]) : resolve(fileNames);
            });
        });
    }

    public async isDirectory(path: string): Promise<boolean> {
        return new Promise(resolve => {
            fs.lstat(path, (error: any, stats: fs.Stats) => {
                if (error) {
                    Logger.log(error);
                }
                resolve(error ? false : stats.isDirectory());
            });
        });
    }
}

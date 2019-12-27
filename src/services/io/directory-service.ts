import * as fs from 'fs';

import IDirectoryService from '../interfaces/directory-service.interface';

export default class DirectoryService implements IDirectoryService {

    public async listDirectory(path: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (error: any, files: string[]) => {

                if (error) {
                    console.log(error);
                }
                error ? reject([]) : resolve(files);
            });
        });
    }

    public async isDirectory(path: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            fs.lstat(path, (error: any, stats: fs.Stats) => {

                if (error) {
                    console.log(error);
                }
                error ? reject(false) : resolve(stats.isDirectory());
            });
        });
    }
}

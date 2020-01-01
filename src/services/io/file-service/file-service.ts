import * as fs from 'fs';

import Logger from '../logger';
import IFileService from '../../interfaces/file-service.interface';

export default class FileService implements IFileService {

    public async readFile(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error: any, data: Buffer) => {
                if (error) {
                    Logger.log(error);
                }
                error ? reject('') : resolve(data);
            });
        });
    }
}

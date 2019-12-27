import * as fs from 'fs';

import IFileService from '../interfaces/file-service.interface';

export default class FileService implements IFileService {

    public async readFile(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error: any, data: Buffer) => {
                if (error) {
                    console.log(error);
                }
                error ? reject('') : resolve(data);
            });
        });
    }
}

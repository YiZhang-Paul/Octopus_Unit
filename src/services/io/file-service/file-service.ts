import { inject, injectable } from 'inversify';
import * as fs from 'fs';

import Types from '../../../ioc/types';
import ILogger from '../../interfaces/logger.interface';
import IFileService from '../../interfaces/file-service.interface';

const { ILogger: ILoggerKey } = Types;

@injectable()
export default class FileService implements IFileService {

    constructor(@inject(ILoggerKey) private _logger: ILogger) { }

    public async readFile(path: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (error: any, data: Buffer) => {
                if (error) {
                    this._logger.log(error);
                }
                error ? reject('') : resolve(data);
            });
        });
    }
}

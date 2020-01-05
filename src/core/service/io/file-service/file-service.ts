import { injectable } from 'inversify';
import * as fs from 'fs';

import Types from '../../../ioc/types';
import Container from '../../../ioc/container';
import ILogger from '../../../interface/io/logger.interface';
import IFileService from '../../../interface/io/file/file-service.interface';

@injectable()
export default class FileService implements IFileService {

    private _logger = Container.get<ILogger>(Types.ILogger);

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

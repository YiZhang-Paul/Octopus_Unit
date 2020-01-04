import IFileNode from '../file/file-node.interface';

export default interface IDirectoryService {
    listDirectoryFlat(path: string): Promise<string[]>;
    listDirectoryRecursive(path: string): Promise<IFileNode[]>;
    isDirectory(path: string): Promise<boolean>;
}

import IFileNode from '../interfaces/file-node.interface';

export default interface IDirectoryViewerService {
    listDirectoryRecursive(path: string): Promise<IFileNode[]>;
}

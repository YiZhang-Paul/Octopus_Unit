export default interface IDirectoryService {
    listDirectory(path: string): Promise<string[]>;
    isDirectory(path: string): Promise<boolean>;
}

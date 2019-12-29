export default interface ICodeGenerator<T> {
    generate(context: T, hookHandlers: any): Promise<T>;
}

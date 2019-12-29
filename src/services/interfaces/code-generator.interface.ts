export default interface ICodeGenerator<T> {
    generate(context: T): Promise<T>;
}

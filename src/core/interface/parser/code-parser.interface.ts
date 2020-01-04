export default interface ICodeParser<TContext, TResolved> {
    parse(context: TContext): Promise<TResolved>;
}

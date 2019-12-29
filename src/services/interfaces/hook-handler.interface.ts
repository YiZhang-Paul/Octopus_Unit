export default interface IHookHandler<TContext, TResolved> {
    override: boolean;
    handle(context: TContext, resolved: TResolved | null): Promise<TResolved>;
}

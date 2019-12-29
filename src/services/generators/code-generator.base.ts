import ICodeGenerator from '../interfaces/code-generator.interface';
import IHookHandler from '../interfaces/hook-handler.interface';

export default abstract class CodeGenerator<TContext, TResolved> implements ICodeGenerator<TContext> {

    constructor(protected _hookHandlers: any) { }

    public abstract generate(context: TContext): Promise<TContext>;

    protected async resolve(
        context: TContext,
        baseHandler: (_: TContext) => Promise<TResolved>,
        hookHandler: IHookHandler<TContext, TResolved>
    ): Promise<TResolved> {

        if (hookHandler && hookHandler.override) {
            return await hookHandler.handle(context, null);
        }
        const resolved = await baseHandler(context);

        return hookHandler ? await hookHandler.handle(context, resolved) : resolved;
    }
}

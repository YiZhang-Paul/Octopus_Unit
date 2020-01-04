import ICodeParser from '../../../interface/parser/code-parser.interface';
import CodeGenerator from '../code-generator.abstract';

export default abstract class TestCaseGenerator<TContext, TResolved> extends CodeGenerator<TContext, TResolved> {

    constructor(parser: ICodeParser<TContext, TResolved>) {
        super(parser);

        this.addBaseHandlers([
            ['signature', this.resolveSignature.bind(this)],
            ['localData', this.resolveLocalData.bind(this)],
            ['mockSetups', this.resolveMockSetups.bind(this)],
            ['invocation', this.resolveInvocation.bind(this)],
            ['assertions', this.resolveAssertions.bind(this)]
        ]);
    }

    protected abstract resolveSignature(context: TContext): Promise<TResolved>;
    protected abstract resolveLocalData(context: TContext): Promise<TResolved>;
    protected abstract resolveMockSetups(context: TContext): Promise<TResolved>;
    protected abstract resolveInvocation(context: TContext): Promise<TResolved>;
    protected abstract resolveAssertions(context: TContext): Promise<TResolved>;
}

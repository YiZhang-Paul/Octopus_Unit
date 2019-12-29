import CodeGenerator from '../code-generator.base';

export default abstract class BoilerplateGeneratorService<TContext, TResolved> extends CodeGenerator<TContext, TResolved> {

    constructor(hookHandlers: any) {
        super(hookHandlers);

        Object.assign(this.baseHandlers, {
            imports: this.resolveImports.bind(this),
            declarations: this.resolveDeclaration.bind(this),
            mocks: this.resolveMocks.bind(this),
            mockSetups: this.resolveMockSetups.bind(this),
            subject: this.resolveUnitUnderTest.bind(this)
        });
    }

    protected abstract resolveImports(context: TContext): Promise<TResolved>;
    protected abstract resolveDeclaration(context: TContext): Promise<TResolved>;
    protected abstract resolveMocks(context: TContext): Promise<TResolved>;
    protected abstract resolveMockSetups(context: TContext): Promise<TResolved>;
    protected abstract resolveUnitUnderTest(context: TContext): Promise<TResolved>;
}

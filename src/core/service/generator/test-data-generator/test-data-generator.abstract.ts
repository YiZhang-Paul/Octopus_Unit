import ICodeParser from '../../../interface/parser/code-parser.interface';
import CodeGenerator from '../code-generator.abstract';

export default abstract class TestDataGenerator<TContext, TResolved> extends CodeGenerator<TContext, TResolved> {

    constructor(parser: ICodeParser<TContext, TResolved>) {
        super(parser);

        this.addBaseHandlers([
            ['declaration', this.resolveDeclaration.bind(this)]
        ]);
    }

    protected abstract resolveDeclaration(context: TContext): Promise<TResolved>;
}

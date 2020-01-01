process.env.NODE_ENV = 'testing';

require('@babel/register')({
    cache: false,
    extensions: ['.ts'],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            }
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        '@babel/proposal-class-properties',
        [
            'istanbul',
            {
                exclude: ['**/*.interface.ts', '**/*.spec.ts']
            }
        ]
    ]
});

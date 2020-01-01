require('@babel/register')({
    cache: false,
    extensions: ['.ts'],
    plugins: [
        '@babel/proposal-class-properties',
        [
            'istanbul',
            {
                exclude: ['**/*.spec.ts']
            }
        ]
    ],
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
});

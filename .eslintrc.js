
module.exports = {
    root: true,
    env: {
        node: true
    },
    'extends': [
        'plugin:vue/essential',
        'eslint:recommended'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    rules: {
        //关闭未定义对象报错
        'no-undef': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

        //关闭定义未使用报错
        "no-unused-vars": "off",
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        //关闭组件命名规则
        "vue/multi-word-component-names": "off",
    },
}

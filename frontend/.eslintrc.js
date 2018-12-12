module.exports = {
    "env": {
        "browser": true,
        "node": true,
        "es6": true,
        "jest": true
    },
    "parser": "babel-eslint",
    "extends": ["eslint:recommended",'plugin:react/recommended'],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "eqeqeq": "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": [
            "error", "always"
        ],
        "arrow-spacing": [
            "error", { "before": true, "after": true }
        ],
        "no-console": 0
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "globals": {
        "test": true,
        "expect": true,
        "describe": true,
        "beforeAll": true,
        "afterAll": true,
        "window": true
    }
};
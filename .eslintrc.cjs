module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "no-unused-vars": 1,
        "no-undef": 1,
        "no-else-return": 1,
        "no-empty-function": 1,
        "no-eq-null": 1,
        "eqeqeq": 1,
        "dot-notation": 1,
        "curly": 1,
        "complexity": 1
    },
    "overrides": [
        {
            "files": ["src/public/**/*.js"],
            "env": {
                "es2021": true,
                "browser": true,
            }
        }
    ]
}

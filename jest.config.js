export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const roots = ['<rootDir>/src', '<rootDir>/tests'];
export const moduleFileExtensions = ['ts', 'js', 'json'];
export const testMatch = ['**/?(*.)+(spec|test).ts'];
export const globals = {
    'ts-jest': {
        tsconfig: 'tsconfig.json',
    },
};

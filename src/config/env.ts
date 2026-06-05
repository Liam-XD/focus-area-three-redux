// This file is responsible for loading and validating environment variables required for the application to function correctly. It ensures that all necessary configuration values are present before the application starts.

const getEnv = (name: string): string => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

export const env = {
    baseUrl: getEnv('RB_BASE_URL'),
    username: getEnv('RB_USERNAME'),
    password: getEnv('RB_PASSWORD'),
};
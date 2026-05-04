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
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'production' | 'development'
        TITLE: string
        PUBLIC_PATH: string
    }
}

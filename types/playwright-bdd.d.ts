//Ambient declaration for `playwright-bdd` to allow Typescript to recognise it as a module and avoid errors when importing it in `playwright.config.ts`.
declare module 'playwright-bdd' {
    export function defineBddConfig(config: any): any; // any disables compile-time checks
}

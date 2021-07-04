declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }

  interface ProcessEnv {
    readonly NODE_ENV: "development" | "production";

    readonly ENV_EXAMPLE: string;
  }
}

declare const process: NodeJS.Process;

declare module "*.svg" {
  const content: string;
  export default content;
}

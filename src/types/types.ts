export interface ContainerData {
  id: number;
  distro: string;
  name: string;
  port: number;
  password: string;
  extraArgs: string | null;
  running: boolean | null;
}

export interface OperationResult {
  success: boolean;
  error?: unknown;
  message?: string;
  [key: string]: unknown;
}

export interface SupportedDistros {
  [id: string]: {
    name: string;
    supported_architectures: Array<string>;
  };
}

export interface EnvironmentData {
  migrationDir: string;
  dataDir: string;
  ncHost: string;
  secretKey: string;
}

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}

export interface userData {
  id: number;
  username: string;
  password: string;
}

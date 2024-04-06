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

export type ISyncFS = Partial<{
    constants: Partial<{
        X_OK: number;
        R_OK: number;
        W_OK: number;
    }>;

    mkdtempSync(prefix: string, options?: { encoding?: BufferEncoding }): string;
    accessSync(path: string, mode?: number): void;
    chmodSync(path: string, mode: number): void;
    statSync(path: string): Partial<{
        birthtime: Date;
        mtime: Date;
        atime: Date;
        size: number;
        isDirectory(): boolean;
        isFile(): boolean;
    }>;
    utimesSync(path: string, atime: Date, mtime: Date): void;
    existsSync(path: string): boolean;
    lstatSync(path: string): {
        isSymbolicLink(): boolean;
    };
    rmSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
    rmdirSync(path: string, options?: { recursive?: boolean; force?: boolean }): void;
    unlinkSync(path: string): void;
    readdirSync(path: string): string[];
    mkdirSync(path: string, options?: { recursive?: boolean; mode?: number }): string;
    renameSync(oldPath: string, newPath: string): void;
    writeFileSync(path: string, data: string | Buffer, options?: BufferEncoding | {
        encoding?: BufferEncoding;
        mode?: number;
        flag?: string
    }): void;
    readlinkSync(path: string, options?: { encoding?: BufferEncoding }): string;
    readFileSync(path: string, options?: BufferEncoding | Partial<{
        encoding: BufferEncoding;
        flag: string
    }>): string | Buffer;
    appendFileSync(path: string, data: string | Buffer, options?: BufferEncoding | {
        encoding?: BufferEncoding;
        mode?: number;
        flag?: string
    }): void;
}>
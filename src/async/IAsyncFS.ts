export type IAsyncFS = Partial<{
    constants: Partial<{
        X_OK: number;
        R_OK: number;
        W_OK: number;
    }>;

    mkdtemp(prefix: string, options?: { encoding?: BufferEncoding } | BufferEncoding): Promise<string>;
    access(path: string, mode?: number): Promise<void>;
    chmod(path: string, mode: number): Promise<void>;
    stat(path: string, options?: { bigint?: boolean } | boolean): Promise<Partial<{
        birthtime: Date;
        mtime: Date;
        atime: Date;
        size: number;
        isDirectory(): boolean;
        isFile(): boolean;
    }>>;
    utimes(path: string, atime: Date, mtime: Date): Promise<void>;
    exists(path: string): Promise<boolean>;
    lstat(path: string, options?: { bigint?: boolean } | boolean): Promise<Partial<{
        isSymbolicLink(): boolean;
    }>>;
    rm(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void>;
    rmdir(path: string, options?: { recursive?: boolean; force?: boolean }): Promise<void>;
    unlink(path: string, options?: { force?: boolean }): Promise<void>;
    readdir(path: string, options?: { encoding?: BufferEncoding } | BufferEncoding): Promise<string[]>;
    mkdir(path: string, options?: { recursive?: boolean; mode?: number } | { mode?: number }): Promise<string>;
    rename(oldPath: string, newPath: string): Promise<void>;
    writeFile(path: string, data: string | Buffer, options?: {
        encoding?: BufferEncoding
    } | BufferEncoding): Promise<void>;
    readlink(path: string, options?: { encoding?: BufferEncoding } | BufferEncoding): Promise<string>;
    readFile(path: string, options?: { encoding?: BufferEncoding } | BufferEncoding): Promise<string | Buffer>;
    appendFile(path: string, data: string | Buffer, options?: BufferEncoding | {
        encoding?: BufferEncoding;
        mode?: number;
        flag?: string
    }): Promise<void>;
}>
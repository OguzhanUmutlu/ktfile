import {FileSync} from "./sync/FileSync";
import {FileAsync} from "./async/FileAsync";

export {FileAsync} from "./async/FileAsync";
export {FileSync, FileSync as File} from "./sync/FileSync";
export * from "./Utils";

export function initFS(fs: typeof import("fs")) {
    FileSync.fs = fs;
    FileAsync.fs = fs.promises;
}

export function fileSync(path: string) {
    return new FileSync(path);
}

export function fileAsync(path: string) {
    return new FileAsync(path);
}

if (typeof process !== "undefined") {
    try {
        initFS(await import("fs"));
        FileSync.sep = FileAsync.sep = process.platform === "win32" ? "\\" : "/";
    } catch {
    }
}
import {FileSync} from "./sync/FileSync";

let cwd: string[] = [];
if (typeof process !== "undefined" && "cwd" in process && typeof process.cwd === "function") {
    cwd = splitPath(process.cwd());
}

export function splitPath(path: string, cd = cwd): string[] {
    if (path[0] === "/" || path[0] === "\\") {
        cd = [];
        path = path.slice(1);
    } else if (/^[a-zA-Z]:\\/.test(path)) {
        cd = [path.slice(0, 2)];
        path = path.slice(3);
    } else cd = [...cd];
    const parts = path.split(/[\\/]/g);
    for (const part of parts) {
        if (part === "..") {
            cd.pop();
        } else if (part !== "." && part !== "") {
            cd.push(part);
        }
    }
    return cd;
}

export const deleteQueue = new Map<string, boolean>();

type BaseType = {
    on: (...args: unknown[]) => void,
    removeAllListeners: (event: string) => void,
    listeners: (event: string) => ((...args: unknown[]) => void)[]
}

function addLast(base: BaseType, event: string, listener: (...args: unknown[]) => void) {
    const listeners = base.listeners(event);
    base.removeAllListeners(event);
    for (const l of listeners) if (l !== listener) base.on(event, l);
    base.on(event, listener);
}

export function cleanup() {
    for (const [file, recursive] of deleteQueue.entries()) new FileSync(file).delete(recursive);
    deleteQueue.clear();
    if (typeof process !== "undefined") {
        process.off("SIGINT", sigint);
        process.off("SIGTERM", sigterm);
        process.off("exit", cleanup);
    } else if (typeof window !== "undefined") {
        window.removeEventListener("beforeunload", cleanup);
        window.removeEventListener("pagehide", cleanup);
    }
}

function sigint() {
    cleanup();
    process.exit(130);
}

function sigterm() {
    cleanup();
    process.exit(143);
}

export function attachCleanup() {
    if (typeof process !== "undefined") {
        addLast(process, "exit", cleanup);
        addLast(process, "SIGINT", sigint);
        addLast(process, "SIGTERM", sigterm);
    } else if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", cleanup);
        window.addEventListener("pagehide", cleanup);
    }
}

export function getPathType(path: string) {
    if (path.includes("/") || path.includes("\\")) {
        return path[0] === "." && (path[1] === "/" || path[1] === "\\") ? "relative" : "absolute";
    }
    return "name";
}
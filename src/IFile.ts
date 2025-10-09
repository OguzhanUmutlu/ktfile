import {splitPath} from "./Utils";
import type {WriteStream} from "node:fs";

export abstract class IFile<FS extends object> {
    protected readonly split: string[];
    constructor(pt: string | string[]) {
        this.split = typeof pt === "string" ? splitPath(pt) : [...pt];
    };

    abstract get fs(): FS;

    abstract get separator(): string;

    get fullPath(): string {
        if (this.split.length === 0) return this.separator;
        return this.split.join(this.separator);
    };

    /**
     * @description Creates a writable stream for the file.
     * This method is used to write data to the file. If the file does not exist,
     * it will be created. If the file already exists, it will be overwritten.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const stream = file.createWriteStream("utf8");
     * stream.write("Hello, World!");
     * stream.end();
     * @param {BufferEncoding} [encoding] - The encoding to use for the stream.
     * If not specified, the stream will return raw Buffer objects.
     * @returns {WritableStream} A writable stream that can be used to write data to the file.
     * The stream accepts data in chunks and writes it to the file.
     * It also emits 'finish' when all data has been written.
     * @throws {Error} If the file system does not support creating a writable stream.
     * This can happen if the underlying file system does not implement the `createWriteStream`
     * method or if the file system is not compatible with this operation.
     */
    createWriteStream(encoding?: BufferEncoding): WritableStream {
        if (typeof this.fs === "object" && "createWriteStream" in this.fs && typeof this.fs.createWriteStream === "function") {
            return this.fs.createWriteStream(this.split.join("/"), encoding);
        }
        throw new Error("File system does not support createWriteStream");
    };

    /**
     * @description Creates a readable stream for the file.
     * This method is used to read the contents of the file as a stream.
     * It is useful for reading large files or when you want to process the file data in chunks.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const stream = file.createReadStream("utf8");
     * stream.on("data", (chunk) => {
     *     console.log("Chunk:", chunk);
     * });
     * stream.on("end", () => {
     *     console.log("Finished reading the file.");
     * });
     * @param {BufferEncoding} [encoding] - The encoding to use for the stream.
     * If not specified, the stream will return raw Buffer objects.
     * @returns {ReadableStream} A readable stream that can be used to read the file.
     * The stream emits 'data' events for each chunk of data read from the file.
     * It also emits 'end' when the end of the file is reached.
     * @throws {Error} If the file system does not support creating a readable stream.
     * This can happen if the underlying file system does not implement the `createReadStream`
     * method or if the file system is not compatible with this operation.
     */
    createReadStream(encoding?: BufferEncoding): ReadableStream {
        if (typeof this.fs === "object" && "createReadStream" in this.fs && typeof this.fs.createReadStream === "function") {
            return this.fs.createReadStream(this.split.join("/"), encoding);
        }
        throw new Error("File system does not support createReadStream");
    };

    /**
     * @description Creates a writable stream for appending data to the file.
     * This method is used to write data to the end of the file without overwriting existing
     * content. It is useful for logging or adding new data to a file.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const stream = file.createAppendStream("utf8");
     * stream.write("New data to append");
     * stream.end();
     * @param {BufferEncoding} [encoding] - The encoding to use for the stream.
     * If not specified, the stream will return raw Buffer objects.
     * @returns {WritableStream} A writable stream that can be used to append data to the file.
     * The stream accepts data in chunks and writes it to the end of the file.
     * It also emits 'finish' when all data has been written.
     * @throws {Error} If the file system does not support creating a writable stream for appending data.
     * This can happen if the underlying file system does not implement the `createWriteStream`
     * method or if the file system is not compatible with this operation.
     */
    createAppendStream(encoding?: BufferEncoding): WritableStream {
        if (typeof this.fs === "object" && "createWriteStream" in this.fs && typeof this.fs.createWriteStream === "function") {
            return this.fs.createWriteStream(this.split.join("/"), {flags: "a", encoding});
        }
        throw new Error("File system does not support createAppendStream");
    };

    /**
     * @description Creates a readable stream for the file.
     * This method is used to read the contents of the file as a stream.
     * It is useful for reading large files or when you want to process the file data in chunks.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const stream = file.createInputStream("utf8");
     * stream.on("data", (chunk) => {
     *     console.log("Chunk:", chunk);
     * });
     * stream.on("end", () => {
     *     console.log("Finished reading the file.");
     * });
     * @param {BufferEncoding} [encoding] - The encoding to use for the stream.
     * If not specified, the stream will return raw Buffer objects.
     * @returns {ReadableStream} A readable stream that can be used to read the file.
     * The stream emits 'data' events for each chunk of data read from the file.
     * It also emits 'end' when the end of the file is reached.
     * @throws {Error} If the file system does not support creating a readable stream.
     * This can happen if the underlying file system does not implement the `createReadStream`
     * method or if the file system is not compatible with this operation.
     */
    createInputStream(encoding?: BufferEncoding): ReadableStream {
        if (typeof this.fs === "object" && "createReadStream" in this.fs && typeof this.fs.createReadStream === "function") {
            return this.fs.createReadStream(this.split.join("/"), {flags: "r", encoding});
        }
        throw new Error("File system does not support createInputStream");
    };

    async download(
        url: string,
        options?: {
            headers?: Record<string, string>,
            method?: "GET" | "POST" | "PUT" | "DELETE",
            body?: any
        },
        update?: (received: number, total: number) => void
    ): Promise<Error | null> {
        const stream = this.createWriteStream();

        try {
            const res = await fetch(url, {
                method: options?.method || "GET",
                headers: options?.headers,
                body: options?.body
            });

            if (!res.ok) {
                await stream.close();
                return new Error(`Request Failed. Status Code: ${res.status}`);
            }

            const totalBytes = parseInt(res.headers.get("content-length") || "0", 10);
            if (update) update(0, totalBytes);

            let receivedBytes = 0;

            if (!res.body) {
                await stream.close();
                return new Error("No response body");
            }

            for await (const chunk of res.body) {
                (<WriteStream><unknown>stream).write(chunk);
                receivedBytes += chunk.length;
                if (update) update(receivedBytes, totalBytes);
            }

            await stream.close();
            return null;
        } catch (err: any) {
            await stream.close();
            return err instanceof Error ? err : new Error(String(err));
        }
    };
}
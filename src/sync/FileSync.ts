import {attachCleanup, deleteQueue} from "../Utils";
import {IFile} from "../IFile";
import {FileAsync} from "../async/FileAsync";
import {ISyncFS} from "./ISyncFS";

export function pass(x: () => unknown): boolean {
    try {
        x();
        return true;
    } catch (e) {
        return false;
    }
}

export function ret<T>(x: () => T): T | null {
    try {
        return x();
    } catch (e) {
        return null;
    }
}

export class FileSync extends IFile<ISyncFS> {
    static fs: ISyncFS;
    static sep = "/";

    static createTempFile(directory: FileSync, prefix: string = "ktfile-temp", suffix: string = ".tmp"): FileSync {
        if (!("mkdTempSync" in FileSync.fs)) {
            throw new Error("mkdTempSync is not available in the current FS.");
        }
        const tempDir = directory ? directory.fullPath : ".";
        const tempPath = this.fs.mkdtempSync(`${tempDir}/${prefix}-`);
        const filePath = `${tempPath}${suffix}`;
        return new FileSync(filePath);
    };

    get fs(): ISyncFS {
        return FileSync.fs;
    };

    /**
     * @description Checks if the file is executable.
     * A file is considered executable if it has the execute permission set.
     * This method checks if the file can be executed by the current user.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.canExecute) {
     *     console.log("This file is executable.");
     * } else {
     *     console.log("This file is not executable.");
     * }
     * @returns {boolean} True if the file is executable, false otherwise.
     * If the file does not exist or cannot be accessed, it will throw an error.
     */
    get canExecute(): boolean {
        return pass(() => this.fs.accessSync(this.fullPath, this.fs?.constants?.X_OK ?? 1));
    };

    /**
     * @description Sets the executable permission for the file.
     * If `value` is true, it sets the permission to allow execution.
     * If `value` is false, it sets the permission to disallow execution.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.canExecute = true; // Sets the file to be executable
     * file.canExecute = false; // Sets the file to be non-executable
     * @param {boolean} value - Whether to allow execution (true) or disallow execution (false).
     */
    set canExecute(value: boolean) {
        pass(() => this.fs.chmodSync(this.fullPath, value ? 0o755 : 0o644));
    };

    /**
     * @description Checks if the file can be read.
     * A file is considered readable if it has the read permission set.
     * This method checks if the file can be accessed for reading by the current user.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.canRead) {
     *     console.log("This file can be read.");
     * } else {
     *     console.log("This file cannot be read.");
     * }
     * @returns {boolean} True if the file can be read, false otherwise.
     * If the file does not exist or cannot be accessed, it will throw an error.
     */
    get canRead(): boolean {
        return pass(() => this.fs.accessSync(this.fullPath, this.fs?.constants?.R_OK ?? 4));
    };

    /**
     * @description Sets the read permission for the file.
     * If `value` is true, it sets the permission to allow reading.
     * If `value` is false, it sets the permission to disallow reading.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.canRead = true; // Sets the file to be readable
     * file.canRead = false; // Sets the file to be non-readable
     * @param {boolean} value - Whether to allow reading (true) or disallow reading (false).
     */
    set canRead(value: boolean) {
        pass(() => this.fs.chmodSync(this.fullPath, value ? 0o644 : 0o000));
    };

    /**
     * @description Checks if the file can be written to.
     * A file is considered writable if it has the write permission set.
     * This method checks if the file can be accessed for writing by the current user.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.canWrite) {
     *     console.log("This file can be written to.");
     * } else {
     *     console.log("This file cannot be written to.");
     * }
     * @returns {boolean} True if the file can be written to, false otherwise.
     * If the file does not exist or cannot be accessed, it will throw an error.
     */
    get canWrite(): boolean {
        return pass(() => this.fs.accessSync(this.fullPath, this.fs?.constants?.W_OK ?? 2));
    };

    /**
     * @description Sets the write permission for the file.
     * If `value` is true, it sets the permission to allow writing.
     * If `value` is false, it sets the permission to disallow writing.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.canWrite = true; // Sets the file to be writable
     * file.canWrite = false; // Sets the file to be non-writable
     * @param {boolean} value - Whether to allow writing (true) or disallow writing (false).
     */
    set canWrite(value: boolean) {
        pass(() => this.fs.chmodSync(this.fullPath, value ? 0o644 : 0o444));
    };

    /**
     * @description Gets the creation time of the file.
     * The creation time is the time when the file was created in the file system.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("Creation time:", file.creationTime);
     * // Output: Creation time: 2023-10-01T12:00:00.000Z
     * @returns {Date | null} The creation time of the file as a Date object, or null if the file does not exist.
     */
    get creationTime(): Date | null {
        return ret(() => this.fs.statSync(this.fullPath).birthtime);
    };

    /**
     * @description Sets the creation time of the file.
     * This method allows you to change the creation time of the file to a specified Date.
     * If the file does not exist, it will throw an error.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.creationTime = new Date("2023-10-01T12:00:00.000Z");
     * // Sets the creation time of the file to the specified date.
     * @param {Date} value - The new creation time to set for the file.
     */
    set creationTime(value: Date) {
        pass(() => this.fs.utimesSync(this.fullPath, value, value));
    };

    /**
     * @description Gets the last modified time of the file.
     * The last modified time is the time when the file was last modified in the file system.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("Last modified time:", file.lastModified);
     * // Output: Last modified time: 2023-10-01T12:00:00.000Z
     * @returns {Date | null} The last modified time of the file as a Date object, or null if the file does not exist.
     */
    get lastModified(): Date | null {
        return ret(() => this.fs.statSync(this.fullPath).mtime);
    };

    /**
     * @description Sets the last modified time of the file.
     * This method allows you to change the last modified time of the file to a specified Date.
     * If the file does not exist, it will throw an error.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.lastModified = new Date("2023-10-01T12:00:00.000Z");
     * // Sets the last modified time of the file to the specified date.
     * @param {Date} value - The new last modified time to set for the file.
     */
    set lastModified(value: Date) {
        pass(() => this.fs.utimesSync(this.fullPath, value, value));
    };

    /**
     * @description Checks if the file exists.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.exists) {
     *    console.log("File exists.");
     * } else {
     *    console.log("File does not exist.");
     * }
     * @returns {boolean | null} True if the file exists, false if it does not, or null if the file system cannot be accessed.
     */
    get exists(): boolean | null {
        return ret(() => this.fs.existsSync(this.fullPath)) ?? pass(() => this.fs.accessSync(this.fullPath));
    };

    /**
     * @description Gets the last access time of the file.
     * The last access time is the time when the file was last accessed in the file system.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("Last access time:", file.lastAccess);
     * // Output: Last access time: 2023-10-01T12:00:00.000Z
     * @returns {Date | null} The last access time of the file as a Date object, or null if the file does not exist.
     */
    get lastAccess(): Date | null {
        return ret(() => this.fs.statSync(this.fullPath).atime);
    };

    /**
     * @description Gets the name of the file.
     * The name is the last part of the file path, which is typically the file name with its extension.
     * If the file path ends with a separator, it returns an empty string.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File name:", file.name);
     * // Output: File name: file.txt
     * @returns {string} The name of the file.
     */
    get name(): string {
        return this.fullPath.split(this.separator).pop() || "";
    };

    /**
     * @description Gets the file name without the extension.
     * The name is the part of the file name before the last dot (.).
     * If there is no dot in the file name, it returns the full name.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File name without extension:", file.nameWithoutExtension);
     * // Output: File name without extension: file
     * @returns {string} The file name without the extension.
     * If the file name does not contain a dot, it returns the full name.
     */
    get nameWithoutExtension(): string {
        const name = this.name;
        const dotIndex = name.lastIndexOf(".");
        return dotIndex === -1 ? name : name.substring(0, dotIndex);
    };

    /**
     * @description Gets the file extension.
     * The extension is the part of the file name after the last dot (.)
     * If there is no dot in the file name, it returns an empty string.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File extension:", file.extension);
     * // Output: File extension: txt
     * @returns {string} The file extension, or an empty string if there is no extension.
     */
    get extension(): string {
        const name = this.name;
        const dotIndex = name.lastIndexOf(".");
        return dotIndex === -1 ? "" : name.substring(dotIndex + 1);
    };

    /**
     * @description Gets the parent directory of the file.
     * If the file is in the root directory, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const parent = file.parent;
     * if (parent) {
     *     console.log("Parent directory:", parent.path);
     * } else {
     *     console.log("This file is in the root directory.");
     * }
     * @returns {FileSync | null} A new FileSync object representing the parent directory of the file,
     * or null if the file is in the root directory.
     */
    get parent(): FileSync | null {
        if (this.split.length === 0) return null;
        return new FileSync(this.split.slice(0, -1));
    };

    /**
     * @description Gets the URI of the file.
     * The URI is a string that represents the file's location in the file system.
     * It is typically in the format `file:///path/to/file`.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File URI:", file.uri);
     * // Output: File URI: file:///path/to/file.txt
     * @returns {string} The URI of the file.
     */
    get uri(): string {
        return `file://${this.fullPath}`;
    };

    /**
     * @description Gets the path separator used by the file system.
     * This is typically the forward slash (/) on Unix-like systems and the backslash (\) on Windows.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("Path separator:", file.separator);
     * // Output: Path separator: /
     * @returns {string} The path separator used by the file system.
     */
    get separator(): string {
        return FileSync.sep;
    };

    /**
     * @description Checks if the file is a directory.
     * A directory is a file that contains other files or directories.
     * @example
     * const dir = new FileSync("path/to/directory");
     * if (dir.isDirectory) {
     *     console.log("This is a directory.");
     * } else {
     *     console.log("This is not a directory.");
     * }
     * @returns {boolean | null} True if the file is a directory, false if it is not, or null if the file does not exist.
     */
    get isDirectory(): boolean | null {
        return ret(() => this.fs.statSync(this.fullPath).isDirectory());
    };

    /**
     * @description Checks if the file is a regular file.
     * A regular file is a file that is not a directory or a symbolic link.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.isFile) {
     *     console.log("This is a regular file.");
     * } else {
     *     console.log("This is not a regular file.");
     * }
     * @returns {boolean | null} True if the file is a regular file, false if it is not, or null if the file does not exist.
     */
    get isFile(): boolean | null {
        return ret(() => this.fs.statSync(this.fullPath).isFile());
    };

    /**
     * @description Checks if the file is hidden.
     * A file is considered hidden if its name starts with a dot (.) or if any part of its path starts with a dot.
     * @example
     * const file = new FileSync("path/to/.hiddenfile");
     * if (file.isHidden) {
     *     console.log("This file is hidden.");
     * } else {
     *     console.log("This file is not hidden.");
     * }
     * @returns {boolean} True if the file is hidden, false otherwise.
     */
    get isHidden(): boolean {
        return this.name.startsWith(".") || this.fullPath.split(this.separator).some(part => part.startsWith("."));
    };

    /**
     * @description Checks if the file is a symbolic link.
     * @example
     * const file = new FileSync("path/to/symlink");
     * if (file.isSymbolicLink) {
     *     console.log("This is a symbolic link.");
     * } else {
     *     console.log("This is not a symbolic link.");
     * }
     * @returns {boolean | null} True if the file is a symbolic link, false if it is not, or null if the file does not exist.
     */
    get isSymbolicLink(): boolean | null {
        return ret(() => this.fs.lstatSync(this.fullPath).isSymbolicLink());
    };

    /**
     * @description Gets the size of the file in bytes.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File size:", file.size, "bytes");
     * @returns {number} The size of the file in bytes, or null if the file does not exist.
     */
    get size(): number | null {
        return ret(() => this.fs.statSync(this.fullPath).size);
    };

    /**
     * @description Gets the size of the file in kilobytes (KB).
     * This is calculated by dividing the size in bytes by 1024.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File size:", file.sizeKB, "KB");
     * @returns {number | null} The size of the file in kilobytes (KB), or null if the file does not exist.
     */
    get sizeKB(): number | null {
        const size = this.size;
        return size !== null ? size / 1024 : null;
    };

    /**
     * @description Gets the size of the file in megabytes (MB).
     * This is calculated by dividing the size in bytes by 1024 * 1024.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File size:", file.sizeMB, "MB");
     * @returns {number | null} The size of the file in megabytes (MB), or null if the file does not exist.
     */
    get sizeMB(): number | null {
        const size = this.size;
        return size !== null ? size / (1024 * 1024) : null;
    }

    /**
     * @description Gets the size of the file in gigabytes (GB).
     * This is calculated by dividing the size in bytes by 1024 * 1024 * 1024.
     * If the file does not exist, it returns null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * console.log("File size:", file.sizeGB, "GB");
     * @returns {number | null} The size of the file in gigabytes (GB), or null if the file does not exist.
     */
    get sizeGB(): number | null {
        const size = this.size;
        return size !== null ? size / (1024 * 1024 * 1024) : null;
    };

    /**
     * @description Creates a new FileSync object with the specified paths appended to the current file's path.
     * This method allows you to create a new file or directory relative to the current file's path.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const newFile = file.to("subdir", "newfile.txt");
     * console.log("New file path:", newFile.path);
     * // Output: New file path: path/to/file.txt/subdir/newfile.txt
     * @param {...string} paths - The paths to append to the current file's path.
     * @returns {FileSync} A new FileSync object with the updated path.
     */
    to(...paths: string[]): FileSync {
        return new FileSync(this.fullPath + "/" + paths.join("/"));
    };

    /**
     * @description Checks if the current file path contains the specified path.
     * This method checks if the current file's path is a parent of the specified path.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const subFile = new FileSync("path/to/file.txt/subdir/subfile.txt");
     * console.log(file.contains(subFile)); // Output: true
     * @param {FileSync} path - The FileSync object to check against the current file's path.
     * @returns {boolean} True if the current file's path contains the specified path, false otherwise.
     */
    contains(path: FileSync): boolean {
        if (path.split.length <= this.split.length) return false;
        for (let i = 0; i < this.split.length; i++) {
            if (this.split[i] !== path.split[i]) return false;
        }
        return true;
    };

    /**
     * @description Creates a new file if it does not exist.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.createFile()) {
     *     console.log("File created or already exists.");
     * } else {
     *     console.log("Failed to create file.");
     * }
     * @param {string | Buffer} [value=""] - The initial content to write to the file.
     * @param {BufferEncoding} [encoding] - The encoding to use when writing the content.
     * @returns {FileSync | null} The FileSync object if the file was created successfully or already exists,
     * or null if the file could not be created.
     */
    createFile(value: string | Buffer = "", encoding?: BufferEncoding): FileSync | null {
        if (!this.exists) return this.write(value, encoding) ? this : null;
        return this.isFile ? this : null;
    };

    /**
     * @description Deletes the file or directory.
     * If the file is a directory and `recursive` is true, it will delete all files and subdirectories within it.
     * If `force` is true, it will ignore errors when deleting files or directories.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.delete(true)) {
     *    console.log("File deleted successfully.");
     * } else {
     *    console.log("Failed to delete file.");
     * }
     * @param {boolean} recursive - Whether to delete the directory and its contents recursively.
     * @param {boolean} [force=false] - Whether to force the deletion, ignoring errors.
     * @returns {FileSync | null} The FileSync object if the file or directory was deleted successfully,
     * or null if the file or directory does not exist or could not be deleted.
     */
    delete(recursive?: boolean, force: boolean = recursive): FileSync | null {
        if (recursive) {
            if ("rmSync" in this.fs) {
                return pass(() => this.fs.rmSync(this.fullPath, {recursive: true, force: force})) ? this : null;
            }
            if ("rmdirSync" in this.fs) {
                return pass(() => this.fs.rmdirSync(this.fullPath, {recursive: true})) ? this : null;
            }
            let failed = false;
            for (const file of this.listFiles() || []) {
                if (!file.delete(true)) failed = true;
            }
            if (failed) return null;
        }
        return pass(() => this.fs.unlinkSync(this.fullPath)) ? this : null;
    };

    /**
     * @description Schedules the file or directory for deletion on exit.
     * This method adds the file or directory to a queue that will be processed when the process
     * exits. If `recursive` is true, it will delete all files and subdirectories within it.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * file.deleteOnExit(true);
     * // The file will be deleted when the process exits.
     * @param {boolean} [recursive=false] - Whether to delete the directory and its contents recursively.
     * @returns {void}
     */
    deleteOnExit(recursive?: boolean): void {
        deleteQueue.set(this.fullPath, recursive);
        attachCleanup();
    };

    /**
     * @description Clears the contents of the file or directory.
     * If the file is a directory and `recursive` is true, it will delete all
     * files and subdirectories within it.
     * If the file is not a directory, it will write an empty string to the file
     * to clear its contents.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.clear(true)) {
     *     console.log("Directory cleared successfully.");
     * } else {
     *     console.log("Failed to clear directory.");
     * }
     * @param {boolean} recursive - Whether to clear the directory and its contents recursively.
     * @returns {FileSync | null} The FileSync object if the directory was cleared successfully,
     * or null if the file is not a directory or could not be cleared.
     */
    clear(recursive: boolean): FileSync | null {
        if (recursive) {
            const files = this.listFiles();
            if (files === null) return null;
            let failed = false;
            for (const file of files || []) {
                if (!file.delete(true)) failed = true;
            }
            return failed ? null : this;
        }
        this.write("");
        return null;
    };

    /**
     * @description Lists all files in the directory.
     * If the file is not a directory, it returns null.
     * @example
     * const dir = new FileSync("path/to/directory");
     * const files = dir.listFiles();
     * if (files) {
     *     files.forEach(file => console.log(file.name));
     * } else {
     *     console.log("Not a directory or no files found.");
     * }
     * @returns {FileSync[] | null} An array of FileSync objects representing the files in the directory,
     * or null if the file is not a directory.
     */
    listFiles(): FileSync[] | null {
        if (!this.isDirectory) return null;
        const files = ret(() => this.fs.readdirSync(this.fullPath));
        if (!files) return null;
        return files.map(file => new FileSync(`${this.fullPath}/${file}`));
    };

    /**
     * @description Reads the contents of the directory.
     * If the file is not a directory, it returns null.
     * @example
     * const dir = new FileSync("path/to/directory");
     * const contents = dir.listFilenames();
     * if (contents) {
     *    contents.forEach(item => console.log(item));
     * } else {
     *   console.log("Not a directory or no contents found.");
     * }
     * @returns {string[] | null} An array of strings representing the names of the files and directories
     * in the directory, or null if the file is not a directory.
     */
    listFilenames(): string[] | null {
        return ret(() => this.fs.readdirSync(this.fullPath));
    };

    /**
     * @description Creates a directory at the specified path.
     * If the directory already exists, it does nothing.
     * If `recursive` is true, it will create all necessary parent directories.
     * @example
     * const dir = new FileSync("path/to/directory");
     * if (dir.mkdir()) {
     *     console.log("Directory created successfully.");
     * } else {
     *     console.log("Failed to create directory.");
     * }
     * @param {boolean} [recursive=false] - Whether to create parent directories if they do not exist.
     * @returns {FileSync | null} The FileSync object if the directory was created successfully,
     * or null if the directory could not be created.
     */
    mkdir(recursive: boolean = false): FileSync | null {
        return pass(() => this.fs.mkdirSync(this.fullPath, {recursive})) ? this : null;
    };

    /**
     * @description Creates the directory and all necessary parent directories.
     * If the directory already exists, it does nothing.
     * This is a convenience method that calls `mkdir` with `recursive` set to true.
     * @example
     * const dir = new FileSync("path/to/directory");
     * if (dir.mkdirs()) {
     *    console.log("Directories created successfully.");
     * } else {
     *   console.log("Failed to create directories.");
     * }
     * @returns {FileSync | null} The FileSync object if the directories were created successfully,
     */
    mkdirs(): FileSync | null {
        return this.mkdir(true) ? this : null;
    };

    /**
     * @description Renames the file or directory to the specified destination.
     * If the destination already exists and `overwrite` is false, it will not overwrite it.
     * If `recursive` is true, it will create parent directories if they do not exist.
     * If the source and destination paths are the same, it does nothing and returns the current FileSync object.
     * @example
     * const file = new FileSync("path/to/source.txt");
     * const dest = new FileSync("path/to/destination.txt");
     * if (file.renameTo(dest, true)) {
     *     console.log("File renamed successfully.");
     * } else {
     *     console.log("Failed to rename file.");
     * }
     * @param {FileSync} dest - The destination directory to rename to.
     * @param {boolean} [overwrite=false] - Whether to overwrite the destination if it already exists.
     * @param {boolean} [recursive=false] - Whether to create parent directories if they do not exist and
     * delete the destination directory recursively if it already exists.
     * @returns {FileSync | null} The FileSync object if the directory was renamed successfully,
     * or null if the directory could not be renamed.
     */
    renameTo(dest: FileSync, overwrite?: boolean, recursive?: boolean): FileSync | null {
        if (this.fullPath === dest.fullPath) return this;
        if (dest.exists && !overwrite && !dest.delete(recursive)) return null;
        if (recursive) this.parent?.mkdirs();
        return pass(() => this.fs.renameSync(this.fullPath, dest.fullPath)) ? this : null;
    };

    /**
     * @description Copies the file to the specified destination.
     * If the destination file already exists and `overwrite` is false, it will not overwrite it.
     * If `recursive` is true, it will copy the contents of the directory recursively.
     * @example
     * const file = new FileSync("path/to/source.txt");
     * const dest = new FileSync("path/to/destination.txt");
     * if (file.copyTo(dest, true)) {
     *     console.log("File copied successfully.");
     * } else {
     *     console.log("Failed to copy file.");
     * }
     * @param {FileSync} dest - The destination file to copy to.
     * @param {boolean} [overwrite=false] - Whether to overwrite the destination file if it already exists.
     * @param {boolean} [recursive=false] - Whether to copy the contents of the directory recursively and
     * delete the destination directory recursively if it already exists.
     * @returns {FileSync | null} The FileSync object if the file was copied successfully,
     * or null if the file could not be copied.
     */
    copyTo(dest: FileSync, overwrite?: boolean, recursive?: boolean): FileSync | null {
        if (this.fullPath === dest.fullPath) return this;
        if (!this.exists) return null;
        if (dest.exists && !overwrite && !dest.delete(recursive)) return null;

        if (this.isFile) {
            const data = this.read();
            if (data === null) return null;
            return dest.write(data) ? this : null;
        }

        if (!dest.mkdir(recursive)) return null;
        const files = this.listFiles();
        if (files === null) return null;
        let failed = false;
        for (const file of files) {
            const newFile = dest.to(file.name);
            if (!file.copyTo(newFile, overwrite, recursive)) failed = true;
        }
        return failed ? null : this;
    };

    /**
     * @description Walks through the directory and yields each file.
     * If the file is a directory, it will yield the directory and then recursively yield all files within it.
     * If the file is not a directory, it will yield the file itself.
     * @example
     * const dir = new FileSync("path/to/directory");
     * for (const file of dir.walk()) {
     *     console.log(file.name);
     * }
     * @returns {Generator<FileSync>} A generator that yields FileSync objects representing the files
     * in the directory and its subdirectories.
     * If the file is not a directory, it will yield the file itself.
     * @yields {FileSync} Each file or directory found during the walk, including subdirectories and their contents.
     */
    * walk(): Generator<FileSync> {
        if (this.isDirectory) {
            yield this;
            for (const file of this.listFiles() || []) {
                yield* file.walk();
            }
        } else yield this;
    };

    /**
     * @description Reads the contents of the file.
     * If the file is a text file, it will return the contents as a string.
     * If the file is a binary file, it will return the contents as a Buffer.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const contents = file.read("utf8");
     * if (contents) {
     *     console.log("File contents:", contents);
     * } else {
     *     console.log("Failed to read file.");
     * }
     * @param {BufferEncoding} [encoding="utf8"] - The encoding to use when reading the file.
     * If not specified, it will return a Buffer for binary files.
     * If specified, it will return a string for text files.
     * @returns {string | Buffer} The contents of the file as a string if encoding is specified,
     * or as a Buffer if encoding is not specified.
     * If reading fails, it will return null.
     */
    read(encoding: BufferEncoding): string | null;
    /**
     * @description Reads the contents of the file as a Buffer.
     * If the file is a binary file, it will return the contents as a Buffer.
     * If the file is a text file, it will return the contents as a Buffer.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const contents = file.read();
     * if (contents) {
     *     console.log("File contents as Buffer:", contents);
     * } else {
     *     console.log("Failed to read file.");
     * }
     * @returns {Buffer} The contents of the file as a Buffer.
     * If reading fails, it will return null.
     */
    read(): Buffer | null;
    read(encoding?: BufferEncoding | null): string | Buffer | null {
        return ret(() => this.fs.readFileSync(this.fullPath, encoding));
    };

    /**
     * @description Reads the contents of the file as an array of lines.
     * If the file is a text file, it will split the contents by new lines.
     * If the file is a binary file, it will return null.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * const lines = file.readLines("utf8");
     * if (lines) {
     *     lines.forEach(line => console.log(line));
     * } else {
     *     console.log("Failed to read file or not a text file.");
     * }
     * @param {BufferEncoding} [encoding="utf8"] - The encoding to use when reading the file.
     * If not specified, it will return null for binary files.
     * @returns {string[] | null} An array of strings representing the lines in the file,
     * or null if the file is a binary file or if reading failed.
     */
    readLines(encoding: BufferEncoding = "utf8"): string[] | null {
        const data = this.read(encoding);
        if (typeof data === "string") return data.split(/\r?\n/);
        return null;
    };

    /**
     * @description Reads the contents of the file as JSON.
     * If the file is a valid JSON file, it will parse and return the contents as an object.
     * If the file is not a valid JSON file or reading fails, it will return null.
     * @example
     * const file = new FileSync("path/to/file.json");
     * const jsonData = file.readJSON();
     * if (jsonData) {
     *     console.log("JSON data:", jsonData);
     * } else {
     *     console.log("Failed to read JSON or not a valid JSON file.");
     * }
     * @returns The parsed JSON data as an object of type T, or null if reading failed or not valid JSON.
     */
    readJSON<T = unknown>(): T | null {
        const data = this.read("utf8");
        if (typeof data !== "string") return null;
        try {
            return JSON.parse(data) as T;
        } catch (e) {
            return null;
        }
    };

    /**
     * @description Reads the symbolic link target of the file.
     * If the file is a symbolic link, it will return a new FileSync object pointing to the target.
     * If the file is not a symbolic link, it will return null.
     * @example
     * const link = new FileSync("path/to/symlink");
     * const target = link.readlink();
     * if (target) {
     *     console.log("Symbolic link points to:", target.path);
     * } else {
     *     console.log("Not a symbolic link or reading failed.");
     * }
     * @returns {FileSync | null} A new FileSync object pointing to the target of the symbolic link,
     * or null if the file is not a symbolic link.
     */
    readlink(): FileSync | null {
        if (!this.isSymbolicLink) return null;
        const linkPath = ret(() => this.fs.readlinkSync(this.fullPath));
        if (!linkPath) return null;
        return new FileSync(linkPath);
    };

    /**
     * @description Writes data to the file.
     * If the file does not exist, it will create the file.
     * If the file exists, it will overwrite the contents with the provided data.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.write("Hello, World!", "utf8")) {
     *     console.log("Data written successfully.");
     * } else {
     *     console.log("Failed to write data.");
     * }
     * @param data - The data to write to the file.
     * @param {Object} encoding - The encoding to use when writing the data.
     * @returns {FileSync | null} True if the data was written successfully, false otherwise.
     */
    write<T>(data: T, encoding: { write(): T }): FileSync | null;
    /**
     * @description Writes data to the file.
     * If the file does not exist, it will create the file.
     * If the file exists, it will overwrite the contents with the provided data.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.write("Hello, World!", "utf8")) {
     *     console.log("Data written successfully.");
     * } else {
     *     console.log("Failed to write data.");
     * }
     * @param {string | Buffer} data - The data to write to the file.
     * @param {BufferEncoding} [encoding="utf8"] - The encoding to use when writing the data.
     * If not specified, it will write the data as a Buffer.
     * @returns {FileSync | null} True if the data was written successfully, false otherwise.
     */
    write(data: string | Buffer, encoding?: BufferEncoding): FileSync | null;
    write<T>(data: T, encoding?: BufferEncoding | { write(): T }): FileSync | null {
        if (encoding !== null && typeof encoding === "object" && "write" in encoding! && typeof encoding!.write === "function") {
            data = encoding.write();
        }
        return pass(() => this.fs.writeFileSync(this.fullPath, data as string | Buffer, encoding as BufferEncoding)) ? this : null;
    };

    /**
     * @description Writes JSON data to the file.
     * If the file does not exist, it will create the file.
     * If the file exists, it will overwrite the contents with the provided JSON data.
     * @example
     * const file = new FileSync("path/to/file.json");
     * const jsonData = { key: "value" };
     * if (file.writeJSON(jsonData)) {
     *     console.log("JSON data written successfully.");
     * } else {
     *     console.log("Failed to write JSON data.");
     * }
     * @param {unknown} data - The JSON data to write to the file.
     * @returns {boolean} True if the JSON data was written successfully, false otherwise.
     */
    writeJSON(data: unknown): FileSync | null {
        return pass(() => this.write(JSON.stringify(data, null, 2))) ? this : null;
    };

    /**
     * @description Appends data to the file.
     * If the file does not exist, it will create the file.
     * If the file exists, it will append the data to the end of the file.
     * @example
     * const file = new FileSync("path/to/file.txt");
     * if (file.append("Hello, World!", "utf8")) {
     *     console.log("Data appended successfully.");
     * } else {
     *     console.log("Failed to append data.");
     * }
     * @param {string | Buffer} data - The data to append to the file.
     * @param {BufferEncoding} [encoding="utf8"] - The encoding to use when appending the data.
     * If not specified, it will append the data as a Buffer.
     * @returns {FileSync | null} The FileSync object if the data was appended successfully,
     * or null if appending failed.
     */
    append(data: string | Buffer, encoding?: BufferEncoding): FileSync | null {
        return pass(() => this.fs.appendFileSync(this.fullPath, data, encoding)) ? this : null;
    };

    get async() {
        return new FileAsync(this.split);
    };
}

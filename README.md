# KTFile

A powerful, cross-platform file system library for JavaScript/TypeScript that provides both synchronous and asynchronous APIs with a clean, object-oriented interface.

## Features

- 🚀 **Dual API**: Both synchronous (`FileSync`) and asynchronous (`FileAsync`) operations
- 🔧 **Cross-platform**: Works in Node.js and other JavaScript environments
- 📁 **Rich file operations**: Create, read, write, copy, move, delete files and directories
- 🎯 **Type-safe**: Full TypeScript support with detailed type definitions
- 🔗 **Path manipulation**: Intuitive path joining and navigation
- 📊 **File metadata**: Access file properties like size, timestamps, permissions
- 🔄 **Directory traversal**: Walk through directory trees with generators
- 📝 **Multiple formats**: Support for text, binary, and JSON file operations

## Installation

```bash
npm install ktfile
```

## Quick Start

### Basic Usage

```javascript
import { fileSync, fileAsync, File } from 'ktfile';

// Synchronous API
const file = fileSync('/path/to/file.txt');
file.write('Hello, world!');
console.log(file.read()); // "Hello, world!"

// Asynchronous API
const asyncFile = fileAsync('/path/to/file.txt');
await asyncFile.write('Hello, async world!');
console.log(await asyncFile.read()); // "Hello, async world!"

// Alternative syntax
const file2 = new File('/another/path');
```

### Node.js Setup

The library automatically initializes with Node.js `fs` module when available. For custom environments:

```javascript
import { initFS } from 'ktfile';
import fs from 'fs';

initFS(fs);
```

## API Reference

### FileSync Class

#### Properties

- `fs: ISyncFS` - The underlying file system instance
- `canExecute: boolean` - File execute permission
- `canRead: boolean` - File read permission
- `canWrite: boolean` - File write permission
- `creationTime: Date | null` - File creation timestamp
- `lastModified: Date | null` - Last modification timestamp
- `lastAccess: Date | null` - Last access timestamp
- `exists: boolean | null` - Whether the file exists
- `name: string` - File name with extension
- `nameWithoutExtension: string` - File name without extension
- `extension: string` - File extension
- `parent: FileSync | null` - Parent directory
- `uri: string` - File URI
- `separator: string` - Path separator for the platform
- `isDirectory: boolean | null` - Whether this is a directory
- `isFile: boolean | null` - Whether this is a regular file
- `isEmpty`: boolean | null` - Whether the file or directory is empty
- `isHidden: boolean` - Whether the file is hidden
- `isSymbolicLink: boolean | null` - Whether this is a symbolic link
- `size: number | null` - File size in bytes
- `sizeKB: number | null` - File size in kilobytes
- `sizeMB: number | null` - File size in megabytes
- `sizeGB: number | null` - File size in gigabytes

#### Methods

##### Path Operations
```javascript
// Join paths
const newPath = file.to('subdirectory', 'file.txt');

// Check if path contains another path
const contains = parentDir.contains(childFile);
```

##### File Creation and Deletion
```javascript
// Create file
file.createFile();

// Create temporary file
const tempFile = FileSync.createTempFile(directory, 'prefix', '.tmp');

// Delete file or directory
file.delete(recursive = false, force = false);

// Schedule deletion on exit
file.deleteOnExit(recursive = false);

// Clear directory contents
directory.clear(recursive = true);
```

##### Directory Operations
```javascript
// Create directory
directory.mkdir(recursive = false);

// Create directory tree
directory.mkdirs();

// List files in directory
const files = directory.listFiles();
const filenames = directory.listFilenames();

// Walk directory tree
for (const file of directory.walk()) {
    console.log(file.name);
}
```

##### File Operations
```javascript
// Copy file
file.copyTo(destination, overwrite = false, recursive = false);

// Move/rename file
file.renameTo(newLocation, overwrite = false, recursive = false);
```

##### Reading Files
```javascript
// Read as string
const content = file.read('utf8');

// Read as Buffer
const buffer = file.read();

// Read lines as array
const lines = file.readLines('utf8');

// Read JSON
const data = file.readJSON();

// Read symbolic link target
const target = symlink.readlink();
```

##### Writing Files
```javascript
// Write string or Buffer
file.write('content', 'utf8');
file.write(buffer);

// Write with custom encoder
file.write(data, { write: () => data });

// Write JSON
file.writeJSON({ key: 'value' });

// Append to file
file.append('more content', 'utf8');
```

### FileAsync Class

The `FileAsync` class provides Promise-based asynchronous operations with a similar API to `FileSync`:

#### Properties

- `fs: IAsyncFS` - The underlying async file system instance
- `name: string` - File name with extension
- `nameWithoutExtension: string` - File name without extension
- `extension: string` - File extension
- `parent: FileAsync | null` - Parent directory
- `uri: string` - File URI
- `separator: string` - Path separator for the platform
- `isHidden: boolean` - Whether the file is hidden
- `sync: FileSync` - Access to synchronous version of this file

#### Methods

All methods that return metadata or perform operations are asynchronous and return Promises:

##### Permission Methods
```javascript
// Check permissions
const canRead = await file.canRead();
const canWrite = await file.canWrite();
const canExecute = await file.canExecute();

// Set permissions
await file.setReadable(true);
await file.setWritable(false);
await file.setExecutable(true);
```

##### Metadata Methods
```javascript
// Get timestamps
const created = await file.creationTime();
const modified = await file.lastModified();
const accessed = await file.lastAccess();

// Set timestamps
await file.setCreationTime(new Date());
await file.setLastModified(new Date());

// File information
const exists = await file.exists();
const isDir = await file.isDirectory();
const isFile = await file.isFile();
const isEmpty = await file.isEmpty();
const isLink = await file.isSymbolicLink();

// File sizes
const bytes = await file.size();
const kb = await file.sizeKB();
const mb = await file.sizeMB();
const gb = await file.sizeGB();
```

##### File Operations
```javascript
// Create and delete
await file.createFile();
await file.delete(recursive, force);
await directory.clear(recursive);

// Copy and move
await file.copyTo(destination, overwrite, recursive);
await file.renameTo(newLocation, overwrite, recursive);
```

##### Directory Operations
```javascript
// Create directories
await directory.mkdir(recursive);
await directory.mkdirs();

// List contents
const files = await directory.listFiles();
const filenames = await directory.listFilenames();

// Walk directory tree (AsyncGenerator)
for await (const file of directory.walk()) {
    console.log(file.name);
}
```

##### Reading Files
```javascript
// Read file contents
const content = await file.read('utf8');
const buffer = await file.read();
const lines = await file.readLines('utf8');
const data = await file.readJSON();

// Read symbolic link
const target = await symlink.readlink();
```

##### Writing Files
```javascript
// Write content
await file.write('content', 'utf8');
await file.write(buffer);
await file.writeJSON({ key: 'value' });
await file.append('more content', 'utf8');
```

##### Static Methods
```javascript
// Create temporary file
const tempFile = FileAsync.createTempFile(directory, 'prefix', '.tmp');
```

## Examples

### Working with Directories

```javascript
import { fileSync } from 'ktfile';

const projectDir = fileSync('./my-project');

// Create project structure
projectDir.mkdirs();
projectDir.to('src').mkdir();
projectDir.to('tests').mkdir();
projectDir.to('docs').mkdir();

// Create files
const packageJson = projectDir.to('package.json');
packageJson.writeJSON({
    name: 'my-project',
    version: '1.0.0'
});

const readme = projectDir.to('README.md');
readme.write('# My Project\n\nDescription here...');

// List all files
for (const file of projectDir.walk()) {
    if (file.isFile) {
        console.log(`File: ${file.name} (${file.sizeKB} KB)`);
    }
}
```

### File Manipulation

```javascript
import { fileSync } from 'ktfile';

const sourceFile = fileSync('./data.json');
const backupFile = fileSync('./backup/data-backup.json');

// Create backup directory
backupFile.parent?.mkdirs();

// Copy file
sourceFile.copyTo(backupFile, true);

// Read and modify JSON
const data = sourceFile.readJSON();
data.lastBackup = new Date().toISOString();
sourceFile.writeJSON(data);

console.log(`Backup created: ${backupFile.size} bytes`);
```

### Async Operations

```javascript
import { fileAsync } from 'ktfile';

async function processFiles() {
    const directory = fileAsync('./uploads');
    const files = await directory.listFiles();
    
    for (const file of files || []) {
        if (file.extension === '.txt') {
            const content = await file.read('utf8');
            const processed = content.toUpperCase();
            
            const outputFile = file.parent?.to('processed', file.name);
            await outputFile?.parent?.mkdirs();
            await outputFile?.write(processed);
            
            console.log(`Processed: ${file.name}`);
        }
    }
}

processFiles().catch(console.error);
```

### Temporary Files

```javascript
import { FileSync, fileSync } from 'ktfile';

const tempDir = fileSync('./temp');
tempDir.mkdirs();

// Create temporary file
const tempFile = FileSync.createTempFile(tempDir, 'data-', '.json');
tempFile.writeJSON({ processing: true, timestamp: Date.now() });

// Use the temporary file
console.log(`Temp file created: ${tempFile.name}`);

// Clean up on exit
tempFile.deleteOnExit();
```

## Error Handling

Methods return `null` when operations fail, allowing for graceful error handling:

```javascript
const file = fileSync('./nonexistent.txt');

const content = file.read();
if (content === null) {
    console.log('File does not exist or cannot be read');
} else {
    console.log('File content:', content);
}

// Check existence before operations
if (file.exists) {
    file.delete();
}
```

## Cross-Platform Compatibility

KTFile handles platform differences automatically:

```javascript
const file = fileSync('./path/to/file.txt');

// Uses correct separator for platform
console.log(file.separator); // '/' on Unix, '\' on Windows

// Paths are normalized automatically
const nested = file.parent?.to('..', 'sibling', 'file.txt');
```

## License

MIT License

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Support

If you find this library useful, please consider starring the repository on GitHub and sharing it with others!

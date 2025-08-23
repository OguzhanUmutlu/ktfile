import {File} from "../src/ktfile"

const folder = new File("folder")

folder.mkdirs()

const file = folder.to("test.txt")

file.write("Hello,")
file.append(" world!")

console.log(
    file.isFile, file.isDirectory, file.creationTime,
    file.canRead, file.canWrite, file.canExecute,
    file.lastModified, file.extension, file.nameWithoutExtension // and much more!
)

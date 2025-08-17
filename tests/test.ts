import {fileSync} from "../src/ktfile";

const file = fileSync("test.txt");
file.write("hello");
file.append("\nworld");

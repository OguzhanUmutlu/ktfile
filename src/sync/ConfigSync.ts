import {Config} from "../IConfig";
import {FileSync} from "./FileSync";

export class ConfigSync extends Config {
    constructor(private file: FileSync, defaultValue = {}) {
        super(defaultValue);
        if (this.file.exists) {
            this.value = this.file.readJSON();
        }
    };

    save() {
        return this.file.writeJSON(this.value) !== null;
    };
}
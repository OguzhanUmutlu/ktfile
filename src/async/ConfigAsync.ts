import {FileAsync} from "./FileAsync";
import {Config} from "../IConfig";

export class ConfigAsync extends Config {
    constructor(private file: FileAsync, defaultValue = {}) {
        super(defaultValue);
    };

    async init() {
        if (await this.file.exists()) {
            this.value = await this.file.readJSON();
        }
        return this;
    };

    async save() {
        return await this.file.writeJSON(this.value) !== null;
    };
}
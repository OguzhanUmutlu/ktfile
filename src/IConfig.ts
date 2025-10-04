export abstract class Config {
    protected constructor(protected value: unknown) {
    };

    get<T>(path: string, default_: T = undefined): T {
        const parts = path.split(".");
        let current: any = this.value;
        for (const part of parts) {
            if (current[part] === undefined) {
                return default_;
            }
            current = current[part];
        }
        return current as T;
    };

    set(path: string, value: any) {
        const parts = path.split(".");
        let current: any = this.value;
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                current[part] = value;
            } else {
                if (current[part] === undefined) {
                    current[part] = {};
                }
                current = current[part];
            }
        }
    };

    abstract save(): boolean | Promise<boolean>;
}
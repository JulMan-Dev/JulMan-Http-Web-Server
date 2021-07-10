import * as fs from 'fs';

export function isDirectory (file: string) {
    try {
        fs.readdirSync(file);
        return true;
    } catch {
        return false;
    }
}
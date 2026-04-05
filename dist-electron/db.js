import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';
let stateFilePath = null;
function getStateFilePath() {
    if (!stateFilePath) {
        stateFilePath = path.join(app.getPath('userData'), 'state.json');
    }
    return stateFilePath;
}
export function initializeDatabase() {
    const filePath = getStateFilePath();
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '{}', 'utf-8');
    }
}
export function saveState(state) {
    const filePath = getStateFilePath();
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
    return true;
}
export function loadState() {
    const filePath = getStateFilePath();
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        const raw = fs.readFileSync(filePath, 'utf-8').trim();
        if (!raw) {
            return null;
        }
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
export function closeDatabase() {
    // No open handles for file-based persistence.
}

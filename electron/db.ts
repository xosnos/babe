import fs from 'node:fs';
import path from 'node:path';
import { app } from 'electron';

type PersistedData = Record<string, unknown>;

let stateFilePath: string | null = null;

function getStateFilePath(): string {
  if (!stateFilePath) {
    stateFilePath = path.join(app.getPath('userData'), 'state.json');
  }
  return stateFilePath;
}

export function initializeDatabase(): void {
  const filePath = getStateFilePath();
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '{}', 'utf-8');
  }
}

export function saveState(state: unknown): boolean {
  const filePath = getStateFilePath();
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
  return true;
}

export function loadState(): PersistedData | null {
  const filePath = getStateFilePath();
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8').trim();
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PersistedData;
  } catch {
    return null;
  }
}

export function closeDatabase(): void {
  // No open handles for file-based persistence.
}

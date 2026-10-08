import fs from 'fs';
import path from 'path';
import { GeneratedFile } from '../types.js';

export class WorkspaceManager {
  private baseDir: string;

  constructor() {
    this.baseDir = path.resolve(process.cwd(), 'workspace', 'generated');
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  public getSessionDir(sessionId: string): string {
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const sessionDir = path.resolve(this.baseDir, safeSessionId);
    if (!sessionDir.startsWith(this.baseDir)) {
      throw new Error('Access denied: Invalid session workspace path.');
    }
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    return sessionDir;
  }

  public writeGeneratedFiles(sessionId: string, files: GeneratedFile[]): void {
    const sessionDir = this.getSessionDir(sessionId);

    for (const file of files) {
      // Prevent directory traversal
      const targetPath = path.resolve(sessionDir, file.path);
      if (!targetPath.startsWith(sessionDir)) {
        throw new Error(`Security violation: File path "${file.path}" escapes workspace boundaries.`);
      }

      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      fs.writeFileSync(targetPath, file.content, 'utf8');
    }
  }

  public applyFilePatch(sessionId: string, relativePath: string, updatedContent: string): void {
    const sessionDir = this.getSessionDir(sessionId);
    const targetPath = path.resolve(sessionDir, relativePath);

    if (!targetPath.startsWith(sessionDir)) {
      throw new Error(`Security violation: Patch path "${relativePath}" escapes workspace boundaries.`);
    }

    const parentDir = path.dirname(targetPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, updatedContent, 'utf8');
  }

  public readWorkspaceFiles(sessionId: string): GeneratedFile[] {
    const sessionDir = this.getSessionDir(sessionId);
    const files: GeneratedFile[] = [];

    const walkDir = (currentDir: string, relPath = '') => {
      if (!fs.existsSync(currentDir)) return;
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        const nextRel = relPath ? `${relPath}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          walkDir(fullPath, nextRel);
        } else if (entry.isFile()) {
          const content = fs.readFileSync(fullPath, 'utf8');
          const ext = path.extname(entry.name);
          let language = 'text';
          if (ext === '.ts') language = 'typescript';
          else if (ext === '.js') language = 'javascript';
          else if (ext === '.py') language = 'python';
          else if (ext === '.json') language = 'json';
          else if (ext === '.md') language = 'markdown';

          files.push({
            path: nextRel,
            language,
            content,
            description: `Generated module: ${nextRel}`
          });
        }
      }
    };

    walkDir(sessionDir);
    return files;
  }
}

export const workspaceManager = new WorkspaceManager();

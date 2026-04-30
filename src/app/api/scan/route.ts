import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const IGNORE_DIRS = ["node_modules", ".git", ".next", "dist", "build"];
const MAX_DEPTH = 3;
const MAX_FILES = 50;

function scanDirectory(dir: string, depth = 0, currentFiles: string[] = []): string[] {
  if (depth > MAX_DEPTH || currentFiles.length >= MAX_FILES) return currentFiles;

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (currentFiles.length >= MAX_FILES) break;

      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.includes(entry.name)) {
          scanDirectory(fullPath, depth + 1, currentFiles);
        }
      } else {
        // Only include readable code files
        if (/\.(ts|tsx|js|jsx|json|md|sql|py|go|java|c|cpp|h)$/i.test(entry.name)) {
          currentFiles.push(fullPath);
        }
      }
    }
  } catch (e) {
    console.error("Error reading directory", dir, e);
  }

  return currentFiles;
}

export async function POST(req: Request) {
  try {
    const { path: dirPath } = await req.json();

    if (!dirPath || typeof dirPath !== "string") {
      return NextResponse.json({ error: "Invalid path provided." }, { status: 400 });
    }

    if (!fs.existsSync(dirPath)) {
      return NextResponse.json({ error: "Directory does not exist." }, { status: 404 });
    }

    const files = scanDirectory(dirPath);
    let summary = `Scanned Directory: ${dirPath}\n\nProject Structure Context:\n`;

    // Read top 10 files to keep context small
    for (const file of files.slice(0, 10)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        const shortContent = content.length > 500 ? content.substring(0, 500) + "..." : content;
        summary += `\n--- FILE: ${path.relative(dirPath, file)} ---\n${shortContent}\n`;
      } catch (e) {
        summary += `\n--- FILE: ${path.relative(dirPath, file)} ---\n[Could not read file]\n`;
      }
    }

    if (files.length > 10) {
      summary += `\n... and ${files.length - 10} other files (truncated for context limits).`;
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to scan directory." }, { status: 500 });
  }
}

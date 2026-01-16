import fs from 'fs';
import path from 'path';

const ROOT = './';

/* ===============================
   EMOJI ICONS
   =============================== */

const icons = {
	folder: '📁',
	code: '💻',
	text: '📝',
	image: '🖼️',
	video: '🎥',
	archive: '📦',
	pdf: '📕',
	word: '📘',
	excel: '📗',
	powerpoint: '📙',
	file: '📄',
};

/* ===============================
   ICON RESOLUTION
   =============================== */

function getType(name, isDir) {
	if (isDir) return 'folder';

	const ext = path.extname(name).toLowerCase();

	if (['.js', '.ts', '.html', '.css'].includes(ext)) return 'code';
	if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext))
		return 'image';
	if (['.mp4', '.webm', '.mov', '.avi', '.mkv'].includes(ext)) return 'video';
	if (['.md', '.txt', '.json'].includes(ext)) return 'text';
	if (['.zip', '.tar', '.gz', '.rar', '.7z'].includes(ext)) return 'archive';
	if (['.pdf'].includes(ext)) return 'pdf';
	if (['.doc', '.docx'].includes(ext)) return 'word';
	if (['.xls', '.xlsx'].includes(ext)) return 'excel';
	if (['.ppt', '.pptx'].includes(ext)) return 'powerpoint';

	return 'file';
}

function getIcon(name, isDir) {
	return icons[getType(name, isDir)];
}

/* ===============================
   HTML GENERATION
   =============================== */

function generate(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	const cards = entries
		.filter((e) => e.name !== 'index.html')
		.map((e) => {
			const isDir = e.isDirectory();
			const href = isDir ? `${e.name}/` : e.name;
			const icon = getIcon(e.name, isDir);

			return `
<a class="card" href="${href}">
  <div class="icon">${icon}</div>
  <div class="name">${e.name}</div>
</a>`;
		})
		.join('');

	const title = path.basename(dir) || 'Files';

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<style>
:root {
  --bg: #f6f8fa;
  --card: #ffffff;
  --border: #e0e0e0;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  padding: 12px;
  font-family: system-ui, -apple-system;
  background: var(--bg);
}

h2 {
  margin: 0 0 12px;
  font-size: 18px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

/* Mobile list layout */
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  text-decoration: none;
  color: #222;
}

.card:active {
  background: #f0f0f0;
}

.icon {
  font-size: 24px;
  flex-shrink: 0;
}

.name {
  font-size: 15px;
  word-break: break-word;
}

/* Grid cards on larger screens */
@media (min-width: 640px) {
  body { padding: 20px; }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .card {
    flex-direction: column;
    text-align: center;
    padding: 16px 12px;
  }

  .icon {
    font-size: 36px;
    margin-bottom: 6px;
  }
}
</style>
</head>

<body>
  <h2>${title}</h2>
  <div class="grid">
    ${cards || '<p>No files</p>'}
  </div>
</body>
</html>`;

	fs.writeFileSync(path.join(dir, 'index.html'), html);

	entries
		.filter((e) => e.isDirectory())
		.forEach((e) => generate(path.join(dir, e.name)));
}

generate(ROOT);
console.log('✔ Directory indexes generated');

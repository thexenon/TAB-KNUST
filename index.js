import fs from 'fs';
import path from 'path';

const ROOT = './';

function generate(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	const cards = entries
		.filter((e) => e.name !== 'index.html')
		.map((e) => {
			const isDir = e.isDirectory();
			const href = isDir ? `${e.name}/` : e.name;
			const icon = isDir ? '📁' : '📄';

			return `
        <a class="card" href="${href}">
          <div class="icon">${icon}</div>
          <div class="name">${e.name}</div>
        </a>
      `;
		})
		.join('');

	const title = path.basename(dir);

	const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<style>
:root {
  --primary: #1e88e5;
  --bg: #f6f8fa;
  --card: #ffffff;
  --border: #e0e0e0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont;
  background: var(--bg);
}

header {
  margin-bottom: 16px;
}

h2 {
  margin: 0;
  font-size: 20px;
  color: #222;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 16px 12px;
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  text-decoration: none;
  color: #222;
  transition: transform .15s ease, box-shadow .15s ease;
}

.card:active {
  transform: scale(0.97);
}

.card:hover {
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
}

.icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.name {
  font-size: 14px;
  word-break: break-word;
}

@media (min-width: 768px) {
  body {
    padding: 24px;
  }
}
</style>
</head>

<body>
  <header>
    <h2>${title}</h2>
  </header>

  <div class="grid">
    ${cards || '<p>No files</p>'}
  </div>
</body>
</html>
`;

	fs.writeFileSync(path.join(dir, 'index.html'), html);

	entries
		.filter((e) => e.isDirectory())
		.forEach((e) => generate(path.join(dir, e.name)));
}

generate(ROOT);
console.log('✔ Directory indexes generated');

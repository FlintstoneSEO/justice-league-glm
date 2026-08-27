import fs from 'node:fs';
import path from 'node:path';

const output = path.join(process.cwd(), 'wix-embeds', 'history-timeline-custom-element.js');
if (!fs.existsSync(output)) throw new Error('History timeline source was not found.');
console.log(`History timeline custom element is ready: ${path.relative(process.cwd(), output)}`);

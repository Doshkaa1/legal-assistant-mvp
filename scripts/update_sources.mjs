// Minimal placeholder updater. In production, fetch target URLs and refresh summaries.
import fs from 'fs'
import path from 'path'
const file = path.join(process.cwd(), 'data', 'sources.json')
const raw = fs.readFileSync(file, 'utf-8')
const data = JSON.parse(raw)
const now = new Date().toISOString()
for (const s of data) {
  s.last_checked_at = now
}
fs.writeFileSync(file, JSON.stringify(data, null, 2))
console.log(`Updated ${data.length} sources at ${now}`)

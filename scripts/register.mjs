// Register / update this app in the Usion registry (Path C). Needs USION_API_TOKEN (usion_sk_…) and PUBLIC_URL.
// First run: prints the new service id and the notify signing secret (shown ONCE) → put both in Railway env.
// Later runs with USION_SERVICE_ID set: PUT updates name/description/tags/iframe_url.
import { readFileSync } from 'node:fs';
const API = process.env.USION_API_URL ?? 'https://mobile.mongolai.mn';
const token = process.env.USION_API_TOKEN, url = process.env.PUBLIC_URL, id = process.env.USION_SERVICE_ID;
if (!token || !url) { console.error('need USION_API_TOKEN and PUBLIC_URL'); process.exit(1); }
const body = { ...JSON.parse(readFileSync(new URL('../service.json', import.meta.url), 'utf8')), iframe_url: url };
const res = await fetch(id ? `${API}/registry/services/my/${id}` : `${API}/registry/services/register`, {
  method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8', Authorization: `Bearer ${token}` }, body: JSON.stringify(body),
});
const text = await res.text();
console.log(res.status, text);
if (!res.ok) process.exit(1);
if (!id) {
  const d = JSON.parse(text);
  console.log('\nUSION_SERVICE_ID=' + (d.id ?? d.service_id ?? d._id ?? '?'));
  if (d.signing_secret) console.log('USION_NOTIFY_SECRET=' + d.signing_secret + '   (shown once — save it now)');
}

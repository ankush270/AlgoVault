import urllib.request
import json
import os
import datetime

# Target file path
PUBLIC_JOBS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/public/data/jobs.json'))

def fetch_remoteok_jobs():
    print("🔍 [Scraper] Fetching live jobs from RemoteOK API...")
    url = "https://remoteok.com/api"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    jobs = []
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            # First item in RemoteOK response is metadata dict
            for item in data[1:]:
                if isinstance(item, dict) and item.get('position'):
                    jobs.append({
                        "company": item.get('company', 'Unknown'),
                        "title": item.get('position', 'Software Engineer'),
                        "location": item.get('location', 'Remote / Worldwide'),
                        "tags": ", ".join(item.get('tags', [])) if isinstance(item.get('tags'), list) else str(item.get('tags', '')),
                        "url": item.get('url', 'https://remoteok.com'),
                        "source": "RemoteOK",
                        "date": item.get('date', datetime.datetime.now().isoformat())
                    })
    except Exception as e:
        print(f"⚠️ RemoteOK fetch error: {e}")
    return jobs

def main():
    jobs = fetch_remoteok_jobs()
    if jobs:
        os.makedirs(os.path.dirname(PUBLIC_JOBS_FILE), exist_ok=True)
        # Read existing jobs if available to merge
        existing = []
        if os.path.exists(PUBLIC_JOBS_FILE):
            try:
                with open(PUBLIC_JOBS_FILE, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            except:
                existing = []
        
        # Merge by URL deduplication
        existing_urls = {j.get('url') for j in existing if j.get('url')}
        new_added = 0
        for j in jobs:
            if j['url'] not in existing_urls:
                existing.insert(0, j)
                existing_urls.add(j['url'])
                new_added += 1

        with open(PUBLIC_JOBS_FILE, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)

        print(f"✅ Successfully updated {PUBLIC_JOBS_FILE}! ({new_added} new jobs added, total {len(existing)} jobs)")
    else:
        print("ℹ️ No new jobs fetched.")

if __name__ == "__main__":
    main()

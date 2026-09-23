import urllib.request
import json
import os
import datetime

PUBLIC_JOBS_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/public/data/jobs.json'))

def fetch_remotive_jobs():
    print("🏢 [Scraper] Fetching tech company jobs from Remotive API...")
    url = "https://remotive.com/api/remote-jobs?category=software-dev&limit=50"
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    jobs = []
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            for item in data.get('jobs', []):
                jobs.append({
                    "company": item.get('company_name', 'Tech Company'),
                    "title": item.get('title', 'Software Engineer'),
                    "location": item.get('candidate_required_location', 'Remote'),
                    "tags": ", ".join(item.get('tags', [])) if item.get('tags') else item.get('category', 'Engineering'),
                    "url": item.get('url', 'https://remotive.com'),
                    "source": "Remotive",
                    "date": item.get('publication_date', datetime.datetime.now().isoformat())
                })
    except Exception as e:
        print(f"⚠️ Remotive fetch error: {e}")
    return jobs

def main():
    jobs = fetch_remotive_jobs()
    if jobs:
        os.makedirs(os.path.dirname(PUBLIC_JOBS_FILE), exist_ok=True)
        existing = []
        if os.path.exists(PUBLIC_JOBS_FILE):
            try:
                with open(PUBLIC_JOBS_FILE, 'r', encoding='utf-8') as f:
                    existing = json.load(f)
            except:
                existing = []
        
        existing_urls = {j.get('url') for j in existing if j.get('url')}
        new_added = 0
        for j in jobs:
            if j['url'] not in existing_urls:
                existing.insert(0, j)
                existing_urls.add(j['url'])
                new_added += 1

        with open(PUBLIC_JOBS_FILE, 'w', encoding='utf-8') as f:
            json.dump(existing, f, indent=2, ensure_ascii=False)

        print(f"✅ Company Scraper: Updated {PUBLIC_JOBS_FILE}! ({new_added} new jobs added)")

if __name__ == "__main__":
    main()

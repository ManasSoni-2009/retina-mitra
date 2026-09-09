import re

with open('netra_bundle.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Match strings in backticks or double quotes or single quotes
matches = re.findall(r'[`"\']([^`"\']{4,120})[`"\']', js)
keywords = ['demo', 'screening', 'quality', 'upload', 'fundus', 'case', 'review', 'referral', 'preset', 'stage', 'netra', 'sahayak']
filtered = [m for m in matches if any(k in m.lower() for k in keywords)]

print(f"Total matches: {len(filtered)}")
unique = []
for item in filtered:
    if item not in unique and not item.startswith(('http', 'rgba', 'data:', 'var(', 'calc(', 'flex', 'grid')):
        unique.append(item)

for u in unique[:100]:
    print("-", u)

with open('netra_bundle.js', 'r', encoding='utf-8') as f:
    js = f.read()

idx = js.find('Early-stage non-proliferative diabetic retinopathy')
if idx != -1:
    content = js[max(0, idx - 2000):idx + 8000]
    with open('netra_cases_extracted.txt', 'w', encoding='utf-8') as out:
        out.write(content)
    print("Saved extracted content to netra_cases_extracted.txt, length:", len(content))

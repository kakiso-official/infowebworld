from docx import Document

doc = Document(r'F:\infoWebWorld\InfoWebWorld_Session_Report_2026-03-23.docx')

sessions = []
for p in doc.paragraphs:
    text = p.text.strip()
    if text.startswith('Session ') and '\u2014' in text:
        sessions.append(text)

print('Total session headings:', len(sessions))
if sessions:
    print('First:', sessions[0])
    print('Last:', sessions[-1])
    print()
    print('All sessions:')
    for s in sessions:
        print(' -', s)

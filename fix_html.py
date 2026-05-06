import re

with open(r'd:\Digilians_Data_Analysis\mas\edit\my-portfolio-main\my-portfolio-main\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find and replace the entire contact-info-grid block
start_marker = '<div class="contact-info-grid">'
start_idx = html.find(start_marker)
if start_idx == -1:
    print('ERROR: contact-info-grid not found')
    exit(1)

# Count nested divs to find the closing tag
depth = 0
idx = start_idx
while idx < len(html):
    if html[idx:idx+4] == '<div':
        depth += 1
    elif html[idx:idx+6] == '</div>':
        depth -= 1
        if depth == 0:
            end_idx = idx + 6
            break
    idx += 1

old_block = html[start_idx:end_idx]
print('Old block length:', len(old_block))

new_block = '''<div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-icon-box">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="summary-info">
                                <h4 data-en="LOCATION" data-ar="\u0627\u0644\u0645\u0648\u0642\u0639">LOCATION</h4>
                                <span data-en="Cairo, Egypt" data-ar="\u0627\u0644\u0642\u0627\u0647\u0631\u0629\u060c \u0645\u0635\u0631">Cairo, Egypt</span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon-box">
                                <i class="fas fa-graduation-cap"></i>
                            </div>
                            <div class="summary-info">
                                <h4 data-en="EDUCATION" data-ar="\u0627\u0644\u0645\u0624\u0647\u0644">EDUCATION</h4>
                                <span data-en="B.Com Accounting" data-ar="\u0628\u0643\u0627\u0644\u0648\u0631\u064a\u0648\u0633 \u062a\u062c\u0627\u0631\u0629 - \u0645\u062d\u0627\u0633\u0628\u0629">B.Com Accounting</span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon-box">
                                <i class="fas fa-language"></i>
                            </div>
                            <div class="summary-info">
                                <h4 data-en="LANGUAGES" data-ar="\u0627\u0644\u0644\u063a\u0627\u062a">LANGUAGES</h4>
                                <span data-en="Arabic, English" data-ar="\u0627\u0644\u0639\u0631\u0628\u064a\u0629\u060c \u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629">Arabic, English</span>
                            </div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-icon-box">
                                <i class="fas fa-briefcase"></i>
                            </div>
                            <div class="summary-info">
                                <h4 data-en="CURRENT ROLE" data-ar="\u0627\u0644\u0645\u0633\u0645\u0649 \u0627\u0644\u062d\u0627\u0644\u064a">CURRENT ROLE</h4>
                                <span data-en="Data Analytics &amp; AI Specialist" data-ar="\u0623\u062e\u0635\u0627\u0626\u064a \u062a\u062d\u0644\u064a\u0644 \u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0630\u0643\u0627\u0621 \u0627\u0635\u0637\u0646\u0627\u0639\u064a">Data Analytics &amp; AI Specialist</span>
                            </div>
                        </div>
                    </div>'''

html = html[:start_idx] + new_block + html[end_idx:]

# Fix the header - replace class="highlight" with "highlight-summary" for the Summary span in about
# Use regex to find and fix specifically the span with data-en="Summary" inside h2
html = re.sub(
    r'(<h2[^>]*>.*?Professional.*?)<span class="highlight"(\s+)(data-en="Summary")',
    r'\1<span class="highlight-summary"\2\3',
    html, flags=re.DOTALL
)

with open(r'd:\Digilians_Data_Analysis\mas\edit\my-portfolio-main\my-portfolio-main\index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('SUCCESS: HTML updated')

# Verify
with open(r'd:\Digilians_Data_Analysis\mas\edit\my-portfolio-main\my-portfolio-main\index.html', 'r', encoding='utf-8') as f:
    content = f.read()
print('summary-grid present:', 'summary-grid' in content)
print('summary-icon-box present:', 'summary-icon-box' in content)
print('highlight-summary present:', 'highlight-summary' in content)
print('contact-info-grid still present:', 'contact-info-grid' in content)

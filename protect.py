import os
import shutil
import re

# ── CONFIGURATION ────────────────────────────────────────────────────────────
SRC_DIR = 'src'
# Files to process
JS_FILES = ['script.js', 'chatbot.js', 'ghost-cursor.js', 'config.js']
CSS_FILES = ['style.css', 'chatbot.css']
HTML_FILES = ['index.html']
STATIC_FOLDERS = ['data']
# ──────────────────────────────────────────────────────────────────────────────

def setup_folders():
    """Initial setup: Move original files to 'src' folder."""
    if not os.path.exists(SRC_DIR):
        print(f"[*] Initial Setup: Creating '{SRC_DIR}' folder...")
        os.makedirs(SRC_DIR, exist_ok=True)
        
        # Move files from root to src
        all_to_move = JS_FILES + CSS_FILES + HTML_FILES
        for f in all_to_move:
            if os.path.exists(f):
                print(f"    Moving {f} -> {SRC_DIR}/{f}")
                shutil.move(f, os.path.join(SRC_DIR, f))
        
        for d in STATIC_FOLDERS:
            if os.path.exists(d):
                print(f"    Moving folder {d} -> {SRC_DIR}/{d}")
                shutil.move(d, os.path.join(SRC_DIR, d))
        
        print("\n[!] Setup complete. From now on, edit your files INSIDE the 'src' folder.")
        print("[!] Run this script again to generate the protected version in the root.\n")

def minify_css(css):
    """Simple CSS Minifier."""
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL) # Remove comments
    css = re.sub(r'\s+', ' ', css) # Collapse spaces
    css = re.sub(r'\s*([\{\}:;,])\s*', r'\1', css) # Remove space around symbols
    return css.strip()

def minify_html(html):
    """Simple HTML Minifier."""
    html = re.sub(r'<!--.*?-->', '', html, flags=re.DOTALL) # Remove comments
    html = re.sub(r'>\s+<', '><', html) # Remove whitespace between tags
    return html.strip()

def simple_minify_js(js):
    """Basic JS cleaning. For professional obfuscation, Node.js is recommended."""
    # Remove single line comments ONLY if not part of a URL (doesn't have ':' before it)
    js = re.sub(r'(?<!:)\/\/.*', '', js)
    # Remove multi-line comments
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    return js.strip()


def build():
    """Process files from src/ and output protected versions to root."""
    print("[*] Protecting and Minifying files...")

    # Process JS
    for f in JS_FILES:
        src_path = os.path.join(SRC_DIR, f)
        if os.path.exists(src_path):
            with open(src_path, 'r', encoding='utf-8') as fs:
                content = fs.read()
            protected = simple_minify_js(content)
            with open(f, 'w', encoding='utf-8') as fd:
                fd.write(protected)
            print(f"    [OK] Protected: {f}")

    # Process CSS
    for f in CSS_FILES:
        src_path = os.path.join(SRC_DIR, f)
        if os.path.exists(src_path):
            with open(src_path, 'r', encoding='utf-8') as fs:
                content = fs.read()
            protected = minify_css(content)
            with open(f, 'w', encoding='utf-8') as fd:
                fd.write(protected)
            print(f"    [OK] Minified:  {f}")

    # Process HTML
    for f in HTML_FILES:
        src_path = os.path.join(SRC_DIR, f)
        if os.path.exists(src_path):
            with open(src_path, 'r', encoding='utf-8') as fs:
                content = fs.read()
            protected = minify_html(content)
            with open(f, 'w', encoding='utf-8') as fd:
                fd.write(protected)
            print(f"    [OK] Minified:  {f}")

    # Sync static folders
    for d in STATIC_FOLDERS:
        src_path = os.path.join(SRC_DIR, d)
        if os.path.exists(src_path):
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(src_path, d)
            print(f"    [OK] Synced:    {d}/")

    print("\n[DONE] Your site is now protected! You can push these changes to GitHub.")

if __name__ == '__main__':
    setup_folders()
    build()

from PIL import Image
import os

files = ["1767434721347.png"]

for f in files:
    try:
        if not os.path.exists(f):
            print(f"File not found: {f}")
            continue
            
        img = Image.open(f)
        
        webp_name = f.replace(".png", ".webp")
        
        # Save directly to WEBP to preserve the alpha channel (transparency)
        img.save(webp_name, "webp", quality=85)
        
        old_size = os.path.getsize(f) / 1024
        new_size = os.path.getsize(webp_name) / 1024
        print(f"Success: {f} ({old_size:.1f}KB) -> {webp_name} ({new_size:.1f}KB) - Transparency preserved!")
    except Exception as e:
        print(f"Error compressing {f}: {e}")

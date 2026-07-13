import glob, os
from PIL import Image
from rembg import remove

os.makedirs("public/hands", exist_ok=True)
os.makedirs("public/characters", exist_ok=True)
os.makedirs("public/projects", exist_ok=True)

def g(pat):
    m = glob.glob(pat)
    if not m:
        raise SystemExit("NOT FOUND: " + pat)
    return m[0]

def cutout(src, dst, width):
    img = Image.open(src).convert("RGBA")
    out = remove(img)
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    r = width / out.width
    out = out.resize((width, round(out.height * r)))
    out.save(dst)
    print("cutout", dst, out.size, flush=True)

def resize_jpg(src, dst, width):
    img = Image.open(src).convert("RGB")
    r = width / img.width
    img = img.resize((width, round(img.height * r)))
    img.save(dst, quality=82)
    print("jpg", dst, img.size, flush=True)

# RPS hands -> transparent
cutout(g("ChatGPT Image Jul 13, 2026, 01_45_54*"), "public/hands/rock.png", 460)
cutout(g("ChatGPT Image Jul 13, 2026, 01_45_49*"), "public/hands/paper.png", 460)
cutout(g("ChatGPT Image Jul 13, 2026, 01_45_56*"), "public/hands/scissors.png", 460)
# character scenes -> transparent
cutout(g("Another_pose_like_about_me*"), "public/characters/about.png", 900)
cutout(g("Collaboration_handshake*"), "public/characters/partnership.png", 1050)
cutout(g("Character_showing_something*"), "public/characters/showing.png", 900)
# updated work mockups
resize_jpg(g("ChatGPT Image Jul 13, 2026, 02_37_46 PM (1)*"), "public/projects/weeziestash.jpg", 1280)
resize_jpg(g("ChatGPT Image Jul 13, 2026, 02_37_46 PM (2)*"), "public/projects/certverify.jpg", 1280)
print("DONE", flush=True)

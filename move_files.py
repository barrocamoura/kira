import os
import shutil

root = "/Users/alessandromoura/.gemini/antigravity/playground/azure-juno"
legacy_dir = os.path.join(root, "legacy-spero-website")

if not os.path.exists(legacy_dir):
    os.makedirs(legacy_dir)

# Files to NOT move to legacy
keep = ["legacy-spero-website", "aura-web", "aura-edge", ".git", ".gemini", ".DS_Store", "node_modules", "move_files.py", "server.log"]

for item in os.listdir(root):
    if item not in keep:
        src = os.path.join(root, item)
        dst = os.path.join(legacy_dir, item)
        print(f"Moving {item} to legacy")
        shutil.move(src, dst)

print("Now moving aura-web to root...")
aura_web = os.path.join(root, "aura-web")
for item in os.listdir(aura_web):
    src = os.path.join(aura_web, item)
    dst = os.path.join(root, item)
    if os.path.exists(dst):
        if os.path.isdir(dst):
            shutil.rmtree(dst)
        else:
            os.remove(dst)
    shutil.move(src, dst)

os.rmdir(aura_web)
print("Done!")

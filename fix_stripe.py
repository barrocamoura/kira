import os

files = ["src/app/api/checkout/route.ts", "src/app/api/webhooks/route.ts"]
for filepath in files:
    if os.path.exists(filepath):
        with open(filepath, "r") as f:
            content = f.read()
        
        target = "apiVersion: '2024-04-10',"
        replacement = "apiVersion: '2025-01-27.acacia' as any,"  # Cast to any to bypass TS literal requirement, or just omit it if possible. Let's cast.
        
        content = content.replace(target, replacement)
        
        with open(filepath, "w") as f:
            f.write(content)


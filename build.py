import zipfile, json, os

root = r'c:\Users\Admin\.gemini\antigravity\scratch\ai-crawler-web\uukanshu-cc'
ext = os.path.join(root, 'uukanshu-cc')
output = os.path.join(ext, 'plugin.zip')

new = zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED)

# Write plugin.json
info = zipfile.ZipInfo('plugin.json')
info.compress_type = 8
info.external_attr = 32
info.create_system = 0
with open(os.path.join(ext, 'plugin.json'), 'rb') as f:
    new.writestr(info, f.read())
print('  -> plugin.json')

# Write icon.png
info = zipfile.ZipInfo('icon.png')
info.compress_type = 8
info.external_attr = 32
info.create_system = 0
with open(os.path.join(ext, 'icon.png'), 'rb') as f:
    new.writestr(info, f.read())
print('  -> icon.png')

# Write all src/*.js
src_dir = os.path.join(ext, 'src')
for f in sorted(os.listdir(src_dir)):
    if f.endswith('.js'):
        info = zipfile.ZipInfo('src/' + f)
        info.compress_type = 8
        info.external_attr = 32
        info.create_system = 0
        with open(os.path.join(src_dir, f), 'rb') as fp:
            new.writestr(info, fp.read())
        print(f'  -> src/{f}')

new.close()
print(f'\nDone: {os.path.getsize(output)} bytes')
print('Files:', zipfile.ZipFile(output).namelist())

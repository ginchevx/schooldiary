@echo off
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
npm install ajv@8.12.0 ajv-keywords@5.1.0 --save-exact
npm run build

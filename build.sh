rm -rf build
cd client
rm -rf build
npm install
npm run build
mv build/ ../
cd ..

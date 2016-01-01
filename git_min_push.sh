HTML_FILE="index.html"
OUTPUT_JS_FILE="all.min.js"

# Remove js files from git tree
git rm -f --cached js/*.js

# concatenate js files into a single, compressed js file
cd js
cat tools.js tests.js ray.js laser.js canvasstate.js curves.js elements.js coordinates.js main.js > all.js
uglifyjs -m -c -- all.js > $OUTPUT_JS_FILE
cd ..
sed -i "/.*script.*/d" $HTML_FILE
echo "<script src='js/$OUTPUT_JS_FILE'></script>" | cat - $HTML_FILE > /tmp/out && mv /tmp/out $HTML_FILE

# push to gh-pages
git add -A
git push origin gh-pages

rm js/all.js
rm js/all.min.js

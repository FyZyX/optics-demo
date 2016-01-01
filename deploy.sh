HTML_FILE="index.html"
BACKUP_HTML_FILE="index.backup.html"
OUTPUT_JS_FILE="all.min.js"




# make a copy of index.html
cp $HTML_FILE $BACKUP_HTML_FILE

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
git checkout gh-pages
git rebase master
git add js/$OUTPUT_JS_FILE
git push origin gh-pages
git checkout master






# cleanup files and restore index.html to its previous state
rm js/all.js
rm js/all.min.js
mv $BACKUP_HTML_FILE $HTML_FILE

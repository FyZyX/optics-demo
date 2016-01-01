HTML_FILE="index.html"
BACKUP_HTML_FILE="index.backup.html"
OUTPUT_JS_FILE="all.min.js"


# switch to gh-pages branch
git checkout gh-pages
git rebase master

# make a copy of index.html
cp $HTML_FILE $BACKUP_HTML_FILE

# concatenate js files into a single, compressed js file
cd js
cat tools.js tests.js ray.js laser.js canvasstate.js curves.js elements.js coordinates.js main.js > all.js
uglifyjs -m -c -- all.js > $OUTPUT_JS_FILE
cd ..
sed -i "/.*script.*/d" $HTML_FILE
echo "<script src='js/$OUTPUT_JS_FILE'></script>" | cat - $HTML_FILE > /tmp/out && mv /tmp/out $HTML_FILE

# Remove all js files from git tree (except for the new one), and push to gh-pages,
git rm -f --cached js/*.js
git add js/$OUTPUT_JS_FILE
git add $HTML_FILE
git push origin gh-pages

# cleanup files and restore index.html to its previous state
rm js/all.js
rm js/all.min.js
mv $BACKUP_HTML_FILE $HTML_FILE



# switch back to master branch
git checkout master

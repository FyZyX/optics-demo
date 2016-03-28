HTML_FILE="index.html"
BACKUP_HTML_FILE="index.backup.html"
OUTPUT_JS_FILE="all.min.js"

COMMIT_MSG="$(git log -1 --pretty=%B)"
COMMIT_MSG=$(echo "$COMMIT_MSG" | sed "s/$COMMIT_MSG/\'$COMMIT_MSG\'/")


# switch to gh-pages branch
git checkout gh-pages
git rebase master

# make a copy of index.html
cp $HTML_FILE $BACKUP_HTML_FILE

# concatenate js files into a single, compressed js file
cd js
cat vector.js snellsLaw.js tools.js ray.js laser.js canvasstate.js curves.js elements.js box.js circplanoconvex.js circplanoconcave.js attrBox.js main.js > all.js
# uglifyjs -m -c -- all.js > $OUTPUT_JS_FILE
java -jar compiler.jar --compilation_level ADVANCED --js all.js --js_output_file all.min.js
cd ..
sed -i "/.*script.*/d" $HTML_FILE
echo "<script src='js/$OUTPUT_JS_FILE'></script>" | cat - $HTML_FILE > /tmp/out && mv /tmp/out $HTML_FILE

# Remove all js files from git tree (except for the new one), and push to gh-pages,
git rm -f --cached js/*.js
git add "js/$OUTPUT_JS_FILE"
git add "$HTML_FILE"
git commit -m "$COMMIT_MSG"
git push --force origin gh-pages

# cleanup files and restore index.html to its previous state
rm js/all.js
rm js/all.min.js
mv $BACKUP_HTML_FILE $HTML_FILE


# switch back to master branch
git stash
git checkout master
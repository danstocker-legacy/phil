#
# Simple build script for JavaScript or shell libraries
# See README.md for more
#
# Copyright (c) 2012 Dan Stocker, http://www.opensource.org/licenses/MIT
#

echo "Usage: ./build.sh [version]"

#
# Defaults
#
EXT="js"

#
# Importing project-specific variables
#
source config.sh
source targets.sh

#
# Determining library version
#
if [ $# -eq 0 ]
then
    VERSION="latest"
else
    VERSION=$1
fi

NAME="$LIB-$VERSION.$EXT"
NAMEMIN="$LIB-$VERSION-min.$EXT"

#
# Preparing output folder
#
if [ ! -d out ]
then
    mkdir out
fi

#
# Cleanup
#
for f in "out/$NAME"*
do
    if [ -e $f ]
    then
        echo Removing "$f".
        rm $f
    fi
done

#
# Concatenating library files
#
cat $FILES > "out/$NAME"

#
# Minification & gzipping
#
if [ "$EXT" == "js" ]
then
    if type yui-compressor >/dev/null 2>&1
    then
        echo "Minifying using YUI compressor."
        yui-compressor "out/$NAME" > out/tmp.$EXT
    elif type yuicompressor >/dev/null 2>&1
    then
        echo "Minifying using YUI compressor."
        yuicompressor "out/$NAME" > out/tmp.$EXT
    elif type jsmin >/dev/null 2>&1
    then
        echo "Minifying using Jsmin."
        jsmin < "out/$NAME" > out/tmp.$EXT
    else
        echo "No minifier found, skipping minification."
    fi

    if [ -f out/tmp.$EXT ]
    then
        # Attempting to add license
        cat js/license.js out/tmp.$EXT > "out/$NAMEMIN"
        rm out/tmp.$EXT

        echo "Gzipping."
        gzip --stdout "out/$NAMEMIN" > "out/$NAMEMIN.gz"
    fi
fi

#
# Finalizing output
#
if [ "$EXT" == "sh" ]
then
    echo "Setting executable bit on shell script."
    chmod 755 "out/$NAME"
fi

#
# Pushing built file(s) to target projects
#
echo "Pushing result to target(s):"
for TARGET in ${TARGETS[@]}
do
    echo . $TARGET

    # Creating target folder when necessary
    if [ ! -d $TARGET ]
    then
        mkdir -p "../$TARGET"
    fi

    # Copying file to target
    cp "out/$NAME" "../$TARGET/"
done

echo Done.

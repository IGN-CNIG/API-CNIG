#!/bin/bash

directory="<directory>"
name="<name_folder>"
url="{mapea.url}"

echo '    {'
echo '     "name" : "'$name'",'
echo '      "resources": ['
for i in $(ls $directory$name)
do
    echo '        {'
    echo '          "file": "'$i'",'
    echo '          "url": "$'$url"assets/svg/"$name'/'$i'"'
    echo '        },'
done
echo '      ]'
echo '    }'

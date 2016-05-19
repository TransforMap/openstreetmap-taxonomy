#!/bin/bash

# written by Michael Maier (s.8472@aon.at)
# 
# 19.05.2016   - intial release
#

# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# version 2 as published by the Free Software Foundation.

###
### Standard help text
###

if [ ! "$1" ] || [ "$1" = "-h" ] || [ "$1" = " -help" ] || [ "$1" = "--help" ]
then 
cat <<EOH
Usage: $0 [OPTIONS] 

$0 is a program to generate JSON structure of SSEDAS tax out of csv files

OPTIONS:
   -h -help --help     this help text

EOH
fi

###
### variables
###

filename="$1"
outfile="${filename%%.csv}.json"

echo -n > "$outfile"

col_cat_name=1
col_cat_nr=2
col_subcat_name=3
col_subcat_nr=4

###
### working part
###

while read -r line
do
   if echo "$line" | grep -q "^category"; then
     continue
   fi

   cat_name=`echo "$line" | cut -f $col_cat_name`
   cat_nr=`echo "$line" | cut -f $col_cat_nr`
   subcat_name=`echo "$line" | cut -f $col_subcat_name`
   subcat_nr=`echo "$line" | cut -f $col_subcat_nr`

   #echo "cat_name=$cat_name"
   #echo "cat_nr=$cat_nr"
   #echo "subcat_name=$subcat_name"
   #echo "subcat_nr=$subcat_nr"
   #echo "initiative_name=$initiative_name"
   #echo "initiative_nr=$initiative_nr"
   #echo "initiative_identifier=$initiative_identifier"
   #echo

   echo "      {"
   echo "        \"item\": {"
   echo "          \"type\": \"uri\","
   echo "          \"value\": \"https://base.transformap.co/entity/Q$subcat_nr\""
   echo "        },"
   echo "        \"itemLabel\": {"
   echo "          \"xml:lang\": \"en\","
   echo "          \"type\": \"literal\","
   echo "          \"value\": \"$subcat_name\""
   echo "        },"
   echo "        \"instance_of\": {"
   echo "          \"type\": \"uri\","
   echo "          \"value\": \"http://base.transformap.co/entity/Q22#taxonomy_category\""
   echo "        },"
   echo "        \"subclass_of\": {"
   echo "          \"type\": \"uri\","
   echo "          \"value\": \"http://base.transformap.co/entity/Q$cat_nr\""
   echo "        }"
   echo "      },"

done < "$filename"


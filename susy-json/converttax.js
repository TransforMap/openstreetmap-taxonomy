function convert_tax_to_tree(flatjson) {
  var treejson = {
    "xml:lang": "en",
    "elements": []
  };

  var flat_elements = flatjson.results.bindings;

  treejson ;

  // get 'root' element
  var root_id = "";
  flat_elements.forEach(function(entry){
    if(entry["instance_of"]) {
      if(entry["instance_of"].value == "https://base.transformap.co/entity/Q12#taxonomy") {
        root_id = entry.item.value;
      }
    }
  });

  // get all 'childs' for this root (main categories)
  flat_elements.forEach(function(entry){
    if(entry["subclass_of"]) {
      if(entry["subclass_of"].value == root_id) {
        treejson.elements.push({
              "type": "category",
              "UUID": entry.item.value,
              "itemLabel": entry.itemLabel.value,
              "elements" : []
        });
      }
    }
  });

  // get all child categories for the main categories

  // get all type of initiatives and hang them to their parent category

  return treejson;
}

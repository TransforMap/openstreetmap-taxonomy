function convert_tax_to_tree(flatjson) {
  var treejson = {
    "xml:lang": "en",
    "elements": []
  };

  var flat_elements = flatjson.results.bindings;

  var flat_category_entries = []; //cats and subcats
  var flat_type_of_initiatives = [];

  var cats_that_hold_type_of_initiatives = [];

  var root_id = "";

  //sort entries into 2 arrays for faster search
  flat_elements.forEach(function(entry){
    if(entry["instance_of"]) {
      if (entry["instance_of"].value == "https://base.transformap.co/entity/Q13742#TypeOfInitiative") {
        flat_type_of_initiatives.push(entry);
      } else if (entry["instance_of"].value == "https://base.transformap.co/entity/Q22#taxonomy_category") {
        flat_category_entries.push(entry);
      } else if(entry["instance_of"].value == "https://base.transformap.co/entity/Q12#taxonomy") {
        root_id = entry.item.value;
      }
    }
  });

  // get all 'childs' for this root (main categories)
  flat_category_entries.forEach(function(entry){
    if(entry["subclass_of"]) {
      if(entry["subclass_of"].value == root_id) {
        treejson.elements.push(
            {
              "type": "category",
              "UUID": entry.item.value,
              "itemLabel": entry.itemLabel.value,
              "elements" : []
            }
        );
      }
    }
  });

  // get all child categories for the main categories
  treejson.elements.forEach(function(category_item){

    var uuid_of_category = category_item.UUID;
    //console.log(uuid_of_category);

    flat_category_entries.forEach(function(entry){
      if(entry["subclass_of"]) {

        if(entry["subclass_of"].value == uuid_of_category) {
          //console.log("add subcat " + entry.itemLabel.value + " to category " + category_item.itemLabel );
          var new_subcat = 
            {
              "type": "subcategory",
              "UUID": entry.item.value,
              "itemLabel": entry.itemLabel.value,
              "elements" : []
            }
          category_item.elements.push(new_subcat);
          cats_that_hold_type_of_initiatives.push(new_subcat);
        }
      }
    });

    if(category_item.elements.length == 0) {
      cats_that_hold_type_of_initiatives.push(category_item);
    }
  });
  //console.log(cats_that_hold_type_of_initiatives);

  // get all type of initiatives and hang them to their parent category
  // remember: objects are called by reference, so this updates the whole treejson structure!
  flat_type_of_initiatives.forEach(function(flat_type_of_initiative) {
    var parent_uuid = flat_type_of_initiative.subclass_of.value;

    cats_that_hold_type_of_initiatives.forEach(function(cat){
      if(cat.UUID == parent_uuid) {
        var type_of_initiative = 
          {
            "type": "type_of_initiative",
            "UUID": flat_type_of_initiative.item.value,
            "itemLabel": flat_type_of_initiative.itemLabel.value,
            "type_of_initiative_tag": flat_type_of_initiative.type_of_initiative_tag.value
          }
        cat.elements.push(type_of_initiative);
      }
    });
  });


  return treejson;
}

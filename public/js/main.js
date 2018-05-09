/// <reference path="D:\Diverse\IT\Proiecte\typings\index.d.ts" />
function selectedColor() {
  var g = Math.floor(Math.random() * 255 + 1);
  var b = Math.floor(Math.random() * 255 + 1);
  var r = Math.floor(Math.random() * 255 + 1);
  return("rgb(" + r + "," + g + "," + b + ")");
}
//==========================SELECTING COUNTRIES FROM THE TABLE============================================
var map = AmCharts.makeChart("mapdiv",{
  type: "map",
  theme: "light",
  addClassNames: true,
  projection: "miller",
  panEventsEnabled : true,
  backgroundColor : "#535364",
  backgroundAlpha : 1,
  zoomControl: {
  zoomControlEnabled : true
  },
  dataProvider : {
  map : "worldHigh",
  getAreasFromMap : true,
  areas :
  [{"id": "RO",
    "description": "Amazing Country"}]
  },
  areasSettings : {
  color : "#FFFFFF",
  colorSolid : "#84ADE9",
  selectedColor : selectedColor(),
  outlineColor : "#666666",
  rollOverColor : "#9EC2F7",
  rollOverOutlineColor : "#000000",
  selectable: true
  },
  "listeners": [{
    "event": "init",
    "method": function(e) {
      preSelectCountries(visitedCountriesID);
    }
  }]
});

jQuery(document).ready(function() {
    var lists = {
      africa: ["AO", "BF", "BI", "BJ", "BW", "CD", "CF", "CG", "CI", "CM", "DJ", "DZ", "EG", "ER", "ET", "GA", "GH", "GM", "GN", "GQ", "GW", "KE", "LR", "LS", "LY", "MA", "MU", "MG", "ML", "MR", "MW", "MZ", "NA", "NE", "NG", "RE", "RW", "SD", "SL", "SN", "SO", "SS", "SZ", "TD", "TG", "TN", "TZ", "UG", "ZA", "ZM", "ZW", "EH", "KM", "GO", "JU", "SH", "ST", "YT", "BV", "CV", "SC"],
      asia: ["AE", "AF", "BD", "BN", "IO", "BT", "CN", "ID", "IL", "IN", "IQ", "IR", "JO", "JP", "KG", "KH", "KP", "KR", "KW", "KZ", "LA", "LB", "LK", "MO", "MM", "MN", "MY", "NP", "OM", "PH", "PK", "PS", "QA", "SA", "SY", "TH", "TJ", "TL", "TM", "TW", "UZ", "VN", "YE", "HK", "MV", "BH", "SG"],
      europe: ["AL", "AM", "AT", "AZ", "BA", "BE", "BG", "BY", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "JE", "FI", "FR", "GB", "GE", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MD", "ME", "MK", "NL", "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SJ", "SK", "TR", "UA", "RU", "VA", "MT", "MC", "XK", "LI", "IM", "GI", "FO", "AD", "AX", "GG", "SM"],
      northAmerica: ["BS", "BZ", "CA", "CR", "CU", "DO", "GL", "GT", "HN", "HT", "JM", "MX", "NI", "PA", "PR", "SV", "US", "AG", "AW", "BB", "BL", "GD", "KN", "LC", "MQ", "TC", "VG", "AI", "BM", "DM", "PM", "GP", "KY", "MF", "MS", "SX", "TT", "VC", "VI", "BQ", "CW"],
      southAmerica: ["AR", "BO", "BR", "CL", "CO", "EC", "FK", "GF", "GY", "PE", "PY", "SR", "UY", "VE", "GS"],
      oceania: ["AS", "AU", "UM-FQ", "CC", "CX", "FJ", "FM", "GU", "HM", "UM-HQ", "UM-DQ", "UM-JQ", "KI", "MH", "UM-MQ", "MP", "NC", "NF", "NR", "NU", "NZ", "PG", "PW", "SB", "TF", "TK", "TL", "TO", "TV", "VU", "UM-WQ", "WF", "WS", "CK", "PF", "PN"]
    };
    var names = {};
    
    map.addListener("clickMapObject", function(event) {
      // if(!event.mapObject.showAsSelected) {
      //   displayModal();
      // } 
      var CC = event.mapObject.id;
      var checkbox = $("input[value=" + CC + "]");
      var anchor = $(checkbox).parents(".tab-pane").attr("id");
      var mapObject = event.mapObject;
  
      map.selectedObject = map.dataProvider;
    
      mapObject.showAsSelected = !mapObject.showAsSelected;
      map.returnInitialColor(mapObject);

      if(typeof(isLoggedIn) !== "undefined") {
        if(isInArray(showVisitedCountryModal()[0], visitedCountriesNames)) {
          $("#country_title_selected").val(showVisitedCountryModal());
          $("#submitButton").click();
        }
        else {
          $("#country_title_selected").val(getSelectedCountries());
          $("#submitButton").click();
        }
      }
      else {
        $("#country_title_noUser").val(getSelectedCountry());
        $("#submitButtonNoUser").click();
      }
      
      $("#country_title").val(getSelectedCountries());
      $("#country_id").val(getSelectedCountriesId());
      
      checkbox[0].checked = event.mapObject.showAsSelected;

      jQuery(".section-map-list .nav-tabs [data-anchor=" + anchor + "]").tab("show");
      deleteVisitedCountries();
      deleteVisitedCountriesIDs();
    });
    
    map.updateSelection = function() {
      var areas = [];
      jQuery(".section-map-list input:checked").each(function() {
        var CC = this.value;
  
        areas.push({
          id: CC,
          showAsSelected: true
        });
      });
      map.dataProvider.areas = areas;
      map.validateData();
      return areas;
    }
    
    // CREATE NAMEMAPPING
    jQuery(AmCharts.maps.worldHigh.svg.g.path).each(function() {
      if (this.title !== undefined)
        names[this.id] = this.title.replace(/x28/g, '(').replace(/x29/g, ')').replace(/x2C/g, ',');
    });
  
    // CREATE LIST
    jQuery(".section-map-list").each(function() {
      jQuery.map(lists, function(list, name) {
        var tbody = jQuery("#" + name).find("tbody");
  
        jQuery(list).each(function() {
          var CC = String(this);
          var row = jQuery("<tr>").appendTo(tbody);
          var col = jQuery("<td>").appendTo(row);
          var div = jQuery("<div>").appendTo(col).addClass("checkbox");
          var label = jQuery("<label>").appendTo(div).text(names[CC]);
          var checkbox = jQuery("<input>").attr({
            type: "checkbox",
            name: "map",
            class: "mr-3",
            value: this
          }).prependTo(label);
  
          row.on("click", function(e) {
            e.stopImmediatePropagation();
            checkbox.prop("checked", !checkbox.prop("checked"));
            map.updateSelection();
            $("#selected").html(getSelectedCountries() + ",");
          });

          checkbox.on("click", function(e) {
            e.stopImmediatePropagation();
            map.updateSelection();
            $("#selected").html(getSelectedCountries() + ",");
          });
        });
      });
    });
});

function getSelectedCountriesId() {
  var selected = [];
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
    if(map.dataProvider.areas[i].showAsSelected)
    selected.push(map.dataProvider.areas[i].id);
  }
  selected = selected.filter(function(val) {
    return visitedCountriesID.indexOf(val) == -1;
  });
  return selected;
};

function getSelectedCountries() {
  var selected = [];
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
      if(map.dataProvider.areas[i].showAsSelected)
      selected.push(map.dataProvider.areas[i].title);
  }
  selected = selected.filter(function(val) {
    return visitedCountriesNames.indexOf(val) == -1;
  });
  return selected;
};

function preSelectCountries(list) {
  for(var i = 0; i < list.length; i++) {
    var area = map.getObjectById(list[i]);
    area.showAsSelected = true;
    map.returnInitialColor(area);
  }
}

function deleteVisitedCountries() {
  var removedCountries = visitedCountriesNames;
  var selected = [];
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
      if(map.dataProvider.areas[i].showAsSelected)
      selected.push(map.dataProvider.areas[i].title);
  }
  removedCountries = visitedCountriesNames.filter(function(val) {
    return selected.indexOf(val) == -1;
  })
  $("#country_title_removed").val(removedCountries);
};

function deleteVisitedCountriesIDs() {
  var removedCountriesIDs = visitedCountriesID;
  var selected = [];
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
      if(map.dataProvider.areas[i].showAsSelected)
      selected.push(map.dataProvider.areas[i].id);
  }
  removedCountriesIDs = visitedCountriesID.filter(function(val) {
    return selected.indexOf(val) == -1;
  })
  $("#country_id_removed").val(removedCountriesIDs);
};

// SHOW MODALS FUNCTIONS==========================================================

// If there is no user logged in
function getSelectedCountry() {
  var selected = [];
  for(var i = 0; i < map.dataProvider.areas.length; i++) {
      if(map.dataProvider.areas[i].showAsSelected)
      selected.push(map.dataProvider.areas[i].title);
  }
  return selected;
};

// Show modal for visited countries
function showVisitedCountryModal() {
  var remainedCountries = getSelectedCountry();
  var selectedVCountry = visitedCountriesNames.filter(function(val){
    return remainedCountries.indexOf(val) == -1;
  })
  return selectedVCountry;
}

function displayModal() {
  $("#modalButton").click()
}

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}



    




       
 





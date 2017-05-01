const BASE_URL = 'http://stats.oecd.org/sdmx-json/data/'

function Oecd(){

};

Oecd.prototype.oecd_request = function(dataset, dimensions, params, preformatted){
	var self = this;
	
	var dimstrs = dimensions.map(get_dimstr);
	var dimstr = dimstrs.join(".");
	
	var url = BASE_URL +'/'+dataset+'/'+dimstr+'/all';
	console.log(url);
	return $.ajax({
		url: url,
		data: params,
		headers: {'Accept':'application/json'}
	}).then(function(data) {
		return data;
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
};

// returns the concatented dim vals of a dimension
var get_dimstr = function(dim){
	return dim.join('+');
};

/*
 get all the possible datasets and descriptions
*/
Oecd.prototype.get_datasets = function(){
	var url = "http://stats.oecd.org/RestSDMX/sdmx.ashx/GetKeyFamily/all";
	return $.ajax({
		url: url,
		dataType: "xml"
	}).then(function(data) {
		dataset_desc_map = {};
		datasets = data.getElementsByTagName("KeyFamily");
		for (var dataset_index in datasets) {
			if (datasets.hasOwnProperty(dataset_index)) {
				var dataset_description = datasets[dataset_index].children[0].innerHTML;
				var dataset_name = datasets[dataset_index].id;
				dataset_desc_map[dataset_name] = dataset_description;
			}
		}
		return dataset_desc_map;
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
};

/*
 Returns the structure of a dataset (datatable). 
 Each dataset has dimensions, and each dimension has possible dimension values
 The dimensions and the possible dimension values are given in brief codes, 
 so the "common_name" variables for each of these in the more descriptive identifier
 example:
 the Dataset QNA has the dimension CL_QNA_LOCATION (common name, Country), and this dimension has the possible value of AUS(common name, Australia)
 */
Oecd.prototype.get_dataset_structure = function(dataset){
	var url = "http://stats.oecd.org/restsdmx/sdmx.ashx/GetDataStructure/" + dataset;
	return $.ajax({
		url: url,
	}).then(function(data) {
		dimensions = Array.from(data.getElementsByTagName("CodeList")); 
		// dimensions required to make a query
		var requiredDims = Array.from(data.getElementsByTagName("Dimension")).map(function(x){return x.attributes.codelist.value; });
		// {dimension_name : {common_name:common_name, values:[{name:dim_val_name, common_name: dim_val_common_name}, ...] }
		var dim_data = {};
		dimensions.forEach(function(x){
			dim_name =x.id;
			var isRequired = (requiredDims.indexOf(dim_name)>=0)? true:false;
			dim_common_name = x.getElementsByTagName("Name")[0].innerHTML;
			var dim_objects = Array.from(x.getElementsByTagName("Code"));
			var dim_vals =[];
			// loop through dimension value objects
			dim_objects.forEach(function(dim_object){
				// get the dimension value name string from the dimenion object
				var name = dim_object.attributes.value.value;
				var common_name= dim_object.children[0].innerHTML;
				var dimension_value ={"name":name, "common_name": common_name}; 
				dim_vals.push(dimension_value);
			})
			dim_data[dim_name]= {"common_name":dim_common_name, "isRequired":isRequired, "values":dim_vals}
		})
		return dim_data;
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
};


var oecd = new Oecd({});


/*
//http://stats.oecd.org/sdmx-json/data/QNA/AUS+AUT+BEL+CAN+CHL.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2009-Q1&endTime=2011-Q4'
// Gross domestic product (expenditure approach)
// VOBARSA: Millions of national currency, volume estimates, OECD reference year, annual levels, seasonally adjusted

var filters = [['USA', 'AUS'],['GDP', "B1_GE"], ['CUR', 'VOBARSA'], ['Q']];
var params = {'startTime': '2009-Q1', 'endTime': '2010-Q1'};
var dataset = 'QNA';
oecd.oecd_request(dataset, filters, params, false).then(function(body){
	console.log( "data:", body );
	var data = sdmxjsonlib.response.mapDataSetsForD3(body);
	var components = sdmxjsonlib.response.mapComponentsForD3(body);
	data.forEach(function(x){console.log(x._key+ " "+ x.obsValue)});
});
 */

/*
//http://stats.oecd.org/sdmx-json/data//AIR_GHG/USA+AUS.GHG.ENER/all
var params = {};
var dataset = 'AIR_GHG';
var filters = [['USA', 'AUS'],['GHG'], ['ENER']];
oecd.oecd_request(dataset, filters, params, false).then(function(body){
	console.log( "data:", body );
	var data = sdmxjsonlib.response.mapDataSetsForD3(body);
	var components = sdmxjsonlib.response.mapComponentsForD3(body);
	data.forEach(function(x){console.log(x._key+ " "+ x.obsValue)});
});
*/







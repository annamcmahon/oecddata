const BASE_URL = 'http://stats.oecd.org/sdmx-json/data/'

function Oecd(){

};

Oecd.prototype.oecd_request = function(dataset, dimensions, params, preformatted){
	var self = this;
	
	var dimstrs = dimensions.map(get_dimstr);
	var dimstr = dimstrs.join(".");
	
	var url = BASE_URL +'/'+dataset+'/'+dimstr+'/all';
	console.log(url);
	$.ajax({
		url: url,
		data: params,
	}).done(function(data) {
		console.log( "data:", data );
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
};

// returns the concatented dim vals of a dimension
var get_dimstr = function(dim){
	return dim.join('+');
}

/*
TODO: get all the possible datasets
*/
Oecd.prototype.get_datasets = function(){
	var url = "http://stats.oecd.org/RestSDMX/sdmx.ashx/GetKeyFamily/all";
	$.ajax({
		url: url,
		dataType: "xml"
	}).done(function(data) {
		// TODO this is XML needs to be parsed
		console.log( "data:", data.document );
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
}

/*
TODO: get a dataset's structure
*/
Oecd.prototype.get_dataset_structure = function(dataset){
	var url = "http://stats.oecd.org/restsdmx/sdmx.ashx/GetDataStructure/" + dataset;
	$.ajax({
		url: url,
	}).done(function(data) {
		console.log( "data:", data );
	})
	.fail(function(error) {
		throw new Error("Request Failed: "+ error.status +", Message: " + error.statusText);
	});
}

// test
//http://stats.oecd.org/sdmx-json/data/QNA/AUS+AUT+BEL+CAN+CHL.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2009-Q1&endTime=2011-Q4'
var filters = [['USA', 'AUS'],['GDP', "B1_GE"], ['CUR', 'VOBARSA'], ['Q']];
var params = {'startTime': '2009-Q1', 'endTime': '2010-Q1'};
var dataset = 'QNA'
var oecd = new Oecd({});
//oecd.oecd_request(dataset, filters, params, false);
oecd.get_datasets();



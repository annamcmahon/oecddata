/* 
 When the window loads, get the dataset names and display them in a table
 */
var query_selections_map = {};
var required = []
window.onload= function() {
	$('#datasets').load('datasets.html', function(){
		oecd.get_datasets().then(function(body){
			fillDatasetsTable(body);
			document.getElementById("datasetsTableDiv").addEventListener("click", selectDataSet);
		});
	});
};


/*
Fill the datasets table with all of the dataset names and common names queired form oecd
*/
var fillDatasetsTable = function(body){
	var table = document.getElementById("datasetsTable");
	for(dataset in body){
		var row = table.insertRow(-1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = dataset;
		cell2.innerHTML = body[dataset];
	}
	return table;
}


/*
fill the dataset structure table (the table you get to when you click on the table) 
 with the dimensions and possible dimmension values
*/
var makeDatasetStructureTable = function(body){
	var struct_table = document.getElementById("datasetsStructTable");
	for(dataset in body){
		var row = struct_table.insertRow(-1); // insert at end of table
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3  = row.insertCell(2);
		cell1.innerHTML = dataset+" ("+ body[dataset].common_name+")";
		cell2.innerHTML = body[dataset].isRequired;
		
		body[dataset].values.forEach(function(x){
			var option_text = x.name+" ("+x.common_name+")";
			var option_button = document.createElement("button");
			option_button.innerHTML = x.name+" ("+x.common_name+")";
			option_button.className = "link";
			option_button.addEventListener("click", clickHandler);
			cell3.append(option_button);
		})
	}
	return struct_table;
}


/*
 In the table of dimensions, this handles the adding of a dimension to the query (via click)
 */
var clickHandler = function(x){
	// set the selected state of the button
	if (!$(this).hasClass("active_button")) {
		$(this).addClass("active_button");
	}else{
		$(this).removeClass("active_button");
	}
	
	var dim_val =this.innerHTML.split(' ')[0]; // get the code and not the common name
	var dimension = this.parentElement.parentElement.cells[0].innerText;
	// check if dimension is in map
	if (dimension in query_selections_map){
		if(query_selections_map[dimension].has(dim_val)){
			query_selections_map[dimension].delete(dim_val);
		}else{
			query_selections_map[dimension].add(dim_val);
		}
	}else{
		query_selections_map[dimension] = new Set();;
		query_selections_map[dimension].add(dim_val);
	}
	var query_arrays = [];
	for(x in query_selections_map){
		query_arrays.push(Array.from(query_selections_map[x]));
	}
	var url = oecd.oecd_url(document.getElementById("datasetTitle").innerHTML.split(' ')[1], query_arrays);
	document.getElementById("queryOptions").innerHTML = url;
}


/*
Make a query to get Oecd data
*/
var makeQuery = function(){
	// checks to make sure query includes required dimensions
	var arr1 =required;
	var arr2 = Object.keys(query_selections_map).map(function(x){return x.split(' ')[0]});
	const containsAll = (arr1, arr2) =>arr2.every(arr2Item => arr1.includes(arr2Item));
	
	if (containsAll(arr2, arr1)){
		document.getElementById("warning").innerHTML ="";
		var win = window.open(document.getElementById("queryOptions").innerHTML, '_blank');
	}else{
		document.getElementById("warning").innerHTML= "You need to include all of the required dimensions in your query";
	}
}


/*
 When a dataset is selected from the table, show data about that datasets structure
 */
var selectDataSet = function(event){
	var target = $(event.target);
	$tr = target.closest('tr');
	var dataset = $tr[0].children[0].innerHTML;
	var dataset_common = $tr[0].children[1].innerHTML;
	document.getElementById("datasets").style.display = 'none';;
	// set up the dataset structure page
	$('#dataset_structure').load('dataset_structure.html', function(){
		document.getElementById("makeQueryButton").addEventListener("click", makeQuery);
		document.getElementById("datasetTitle").innerHTML += dataset+ " ("+dataset_common+") ";
	});
	
	oecd.get_dataset_structure(dataset).then(function(body){
		required = Object.keys(body).filter(function(x){ return body[x].isRequired});
		var dsStructTable = makeDatasetStructureTable(body);
		document.getElementById("tableDiv").append(dsStructTable);
	});
}




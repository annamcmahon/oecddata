/* 
 When the window loads, get the dataset names and display them in a table
 */
var query_selections_map = {};
window.onload= function() {
	oecd.get_datasets().then(function(body){
		var datasetsTable = makeDatasetsTable(body);
		document.getElementById("tableDiv").append(datasetsTable);
	});
};

var makeDatasetsTable = function(body){
	var table = document.createElement("TABLE");
	for(dataset in body){
		var row = table.insertRow(0);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		cell1.innerHTML = dataset;
		cell2.innerHTML = body[dataset];
	}
	return table;
}

var makeDatasetStructureTable = function(body){
	var struct_table = document.createElement("TABLE");
	for(dataset in body){
		var row = struct_table.insertRow(-1); // insert at end of table
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3  = row.insertCell(2);
		cell1.innerHTML = dataset+" ("+ body[dataset].common_name+")";
		cell2.innerHTML = body[dataset].isRequired;
		var options_div = document.createElement("div");
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
var clickHandler = function(x){
	
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
	var url = oecd.oecd_url(document.getElementById("datasetTitle").innerHTML, query_arrays);
	document.getElementById("query_options").innerHTML = url;
	// set the selected state of the button
}

var makeQuery = function(){
	// make checks
	var win = window.open(document.getElementById("query_options").innerHTML, '_blank');
}

var makeQueryDiv = function(){
	var query_div = document.createElement("div");
	query_div.id = "queryDiv";
	var query_text = document.createElement("h3");
	var query_options = document.createElement("div");
	query_options.id = "query_options";
	query_text.innerHTML = "Selected options for your Query";
	var query_button = document.createElement("button");
	query_button.innerHTML = "Make Query";
	query_button.addEventListener("click", makeQuery);
	query_div.append(query_text);
	query_div.append(query_options);
	query_div.append(query_button);
	return query_div;
}


/*
 When a dataset is selected from the table, show data about that datasets structure
 */
$('#tableDiv').click( function(event) {
	var target = $(event.target);
	$tr = target.closest('tr');
	var dataset = $tr[0].children[0].innerHTML;
	var dataset_common = $tr[0].children[1].innerHTML;
	document.getElementById("tableDiv").style.display = 'none';;
					 

	document.getElementById("datasetTitle").innerHTML = dataset;
	document.getElementById("datasetCommonTitle").innerHTML = dataset_common;

	oecd.get_dataset_structure(dataset).then(function(body){
		var dsStructTable = makeDatasetStructureTable(body);
		var query_div = makeQueryDiv();

		var structureTableDiv= document.createElement("div");
		structureTableDiv.id = "structureTableDiv";
		document.getElementById("infoDiv").append(structureTableDiv);
		structureTableDiv.append(dsStructTable);
		document.getElementById("infoDiv").append(query_div);
	});
});



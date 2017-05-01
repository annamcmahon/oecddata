/* 
 When the window loads, get the dataset names and display them in a table
 */
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
		var row = struct_table.insertRow(0);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3  = row.insertCell(2);
		cell1.innerHTML = dataset+" ("+ body[dataset].common_name+")";
		cell2.innerHTML = body[dataset].isRequired;
		var values = body[dataset].values.map(function(x){return x.name+" ("+x.common_name+")"});
		cell3.innerHTML = values.join();
	}
	return struct_table;
}

/*
 When a dataset is selected from the table, show data about that datasets structure
 */
$('tr').click(function(){tes();});
	$('#tableDiv').click( function(event) {
	var target = $(event.target);
	$tr = target.closest('tr');
	var dataset = $tr[0].children[0].innerHTML;
	var dataset_common = $tr[0].children[1].innerHTML;
	var tableDiv = document.getElementById("tableDiv");
	tableDiv.style.display = 'none';
	var infoDiv= document.getElementById("infoDiv");
	document.getElementById("datasetTitle").innerHTML = dataset;
	document.getElementById("datasetCommonTitle").innerHTML = dataset_common;

	oecd.get_dataset_structure(dataset).then(function(body){
		var dsStructTable = makeDatasetStructureTable(body);
		infoDiv.append(dsStructTable);
	});
});



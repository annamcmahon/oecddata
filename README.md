# OECD Data Explorer
## About 
The Organization for Economic Cooperation and Development's [(OECD)](https://data.oecd.org/) has a ton of datasets. They also have an [API](https://data.oecd.org/api/) for interacting with these datasets. 

### Existing OECD Api Details 
* All requests to the API are of the format:
http://stats.oecd.org/SDMX-JSON/data/<dataset identifier>/<filter expression>/<agency name>[ ?<additional parameters>]

* Get all the data from a dataset:  
http://stats.oecd.org/sdmx-json/data/QNA/all/all?startTime=2009-Q1&endTime=2011-Q4

* Get data with filters:
http://stats.oecd.org/sdmx-json/data/QNA/AUS+AUT+BEL+CAN+CHL.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2009-Q1&endTime=2011-Q4'

Each dataset can be filtered by a set of dimensions. The "filter expression" can consist of a variety of dimensions/ dimension values that are all represented in short abbreviations.

the Dataset QNA (Quarterly National Accounts) has the dimension CL_QNA_LOCATION (Country), and this dimension has the possible value of AUS(Australia).

Figuring out things like the CL_QNA_LOCATION dimension has values that are countires, and then getting a list of the countries that can be used as dimension value is not easy. Its kinda hard to figure out what all the datasets and dimensions are, which ones are required, etc. so I just made something that makes that easier. 

## Components:
	1. A simple wrapper around the oecd api to get information about all the datasets and their dimensions
	2. A website to explore the datasets, their dimensions, and and construct valid Oecd api requests,


## Resources:
[OECD API reference](https://data.oecd.org/api/sdmx-json-documentation/)
[R OECD API reference](https://github.com/expersso/OECD)

###Work in progress:
Also working on being able to display the results of the query using [sdmxjsonlib](http://github.com/airosa/sdmxjsonlib) and d3.





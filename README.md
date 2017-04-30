oecd consists of datasets, and each dataset can be filtered by a set of dimensions

api documentation: https://data.oecd.org/api/sdmx-json-documentation/
R API reference: https://github.com/expersso/OECD

requests are of the format:
http://stats.oecd.org/SDMX-JSON/data/<dataset identifier>/<filter expression>/<agency name>[ ?<additional parameters>]


Examples
Get all the data from a dataset:  
http://stats.oecd.org/sdmx-json/data/QNA/all/all?startTime=2009-Q1&endTime=2011-Q4

get data with filters:
http://stats.oecd.org/sdmx-json/data/QNA/AUS+AUT+BEL+CAN+CHL.GDP+B1_GE.CUR+VOBARSA.Q/all?startTime=2009-Q1&endTime=2011-Q4'





# OpenTripPlanner

This is a required step: Get a OSM pbf file. This is used by OTP to calculate walking paths.
`wget -O map.osm.pbf https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf`

This file only loads Berlin and Brandenburg. Enought for local development. Searching for
connections outside of Berlin Brandenburg will fail.

They have more maps: https://download.geofabrik.de/europe/germany/brandenburg.html

## Use the dockerfile if you just want to start deveoping

## Continue reading if you want to know how OTP works and run it localy

Download the latest OTP jar here: https://repo1.maven.org/maven2/org/opentripplanner/otp/

OTP reads the map.osm.pfb and builds an own file from it: streetGraph.obj. THat does not include any GTFS trips yet.

Run `java -Xmx2G -jar otp2.1.jar --buildStreet --save .` to build the graph with street info only.

If GTFS needs to be added or updated, you only need to run:

- `java -Xmx2G -jar otp2.1.jar --loadStreet --save .`

This does not scan the OSM data again and saves a lot of time.

You should now have 2 .obj files: `graph.obj` and `streetGraph.obj`. These files are needed by OTP before you start it.
If the GTFS needs to be updated in OTP, you need to rebuild the graph.obj again.

To start the server:

`java -Xmx2G -jar otp2.1.jar --load .`

Routes:

https://github.com/opentripplanner/OpenTripPlanner/blob/dev-2.x/src/main/java/org/opentripplanner/index/IndexAPI.java

http://localhost:8082/otp/routers/ - router info
http://localhost:8082/otp/routers/default/index/stops - all stops

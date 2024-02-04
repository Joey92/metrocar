wget -O full.osm.pbf https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf
osmium tags-filter full.osm.pbf w/highway wa/public_transport=platform wa/railway=platform w/park_ride=yes r/type=restriction r/type=route -o osm.pbf -f pbf,add_metadata=false
cp osm.pbf services/graphhopper
cp osm.pbf services/otp

wget -O otp.jar https://repo1.maven.org/maven2/org/opentripplanner/otp/2.4.0/otp-2.4.0-shaded.jar
mv otp-2.4.0-shaded.jar services/otp

echo "Done!"

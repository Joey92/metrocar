#!/bin/bash
set -e

rm -f area.* || true
rm -f *.geojson || true
rm -f *.pbf || true
rm -f *.txt || true
rm -f gtfs.zip || true

wget --no-check-certificate -O gtfs.tar.gz $1

if [[ ! -e "last_version" ]]; then
    touch last_version
fi

last_version=($(cat last_version))
tag=($(sha1sum gtfs.tar.gz))

echo $last_version

# TODO: version is always different when pulling gtfs.zip
# even though nothing changed
if [[ "$last_version" == "$tag" ]]; then
    echo "No changes were made in the gtfs.tar.gz. Will skip"
    exit 0
fi

echo $tag > last_version

tar -xzvf gtfs.tar.gz

osmium extract --overwrite -c area.json ../map.osm.pbf

# build the official gtfs.zip
zip gtfs.zip *.txt

docker build -t otp:$tag .

docker service update --image otp:$tag metrocar_otp

FROM eclipse-temurin:18-jre-alpine as otp_download
RUN apk update && apk add wget
WORKDIR /otp
# ARG otp_url=https://repo1.maven.org/maven2/org/opentripplanner/otp/2.4.0/otp-2.4.0-shaded.jar
# RUN wget -O otp.jar $otp_url
COPY otp.jar .

FROM otp_download as build

# ARG pbf=https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf
# RUN wget -O osm.pbf $pbf

COPY *.pbf ./

RUN java -Xmx4G -jar otp.jar --buildStreet --save .

# ARG gtfs_url=https://api.metrocar.localhost/gtfs.zip
COPY gtfs* ./
RUN java -Xmx6G -jar otp.jar --loadStreet --save .

FROM otp_download as run

COPY --from=build /otp/graph.obj .
COPY router-config.json .
EXPOSE 8082

CMD java -Xmx4G -jar otp.jar --port 8082 --load .

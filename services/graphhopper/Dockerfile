FROM maven:3.6.3-jdk-8 as build
RUN apt-get install -y wget
WORKDIR /graphhopper
RUN git clone https://github.com/graphhopper/graphhopper
RUN cd graphhopper && mvn clean package -DskipTests

# ARG pbf=https://download.geofabrik.de/europe/germany/brandenburg-latest.osm.pbf
# RUN wget -O map.osm.pbf $pbf
COPY osm.pbf osm.pbf

FROM openjdk:11-jre-slim

ENV JAVA_OPTS "-Xmx8g -Xms8g -Ddw.server.application_connectors[0].bind_host=0.0.0.0 -Ddw.server.application_connectors[0].port=8989"

WORKDIR /graphhopper

COPY --from=build /graphhopper/graphhopper/web/target/graphhopper*.jar ./
COPY --from=build /graphhopper/osm.pbf .

COPY ./config.yml ./

EXPOSE 8989
EXPOSE 8990

CMD java $JAVA_OPTS -jar *.jar server config.yml

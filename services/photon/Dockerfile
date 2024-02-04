FROM eclipse-temurin:18-jre-alpine
RUN apk update && apk add wget
WORKDIR /photon

RUN wget -O photon.jar https://github.com/komoot/photon/releases/download/0.4.1/photon-0.4.1.jar

ENV NOMINATIM_HOST=localhost
ENV NOMINATIM_PORT=5432
ENV NOMINATIM_DATABASE=nominatim
ENV NOMINATIM_DATABASE_USER=nominatim
ENV NOMINATIM_DATABASE_PASSWORD=nominatim
ENV EXTRA_FLAG=""

CMD java -Xmx4G -jar photon.jar -host ${NOMINATIM_HOST} -port ${NOMINATIM_PORT} -database ${NOMINATIM_DATABASE} -user ${NOMINATIM_DATABASE_USER} -password ${NOMINATIM_DATABASE_PASSWORD} ${EXTRA_FLAG}

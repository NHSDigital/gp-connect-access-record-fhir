#First Stage
FROM alpine:latest  
RUN apk add jq
COPY "build/gp-connect-access-record-fhir.json" ./
COPY "PrismMockReceiver/HealthStatusEndpoint.json" ./
RUN jq ".paths+=$(cat HealthStatusEndpoint.json)" gp-connect-access-record-fhir.json > updated-spec.json


#Second stage
FROM stoplight/prism:latest 
COPY --from=0  /updated-spec.json  /usr/src/prism/packages/cli/gp-connect-access-record-fhir/specification/gp-connect-access-record-fhir.json

#Running command of mock with OAS file
CMD ["mock" , "-h", "0.0.0.0", "-p" ,"9000" ,"gp-connect-access-record-fhir/specification/gp-connect-access-record-fhir.json"]
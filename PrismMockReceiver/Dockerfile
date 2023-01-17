FROM stoplight/prism:latest 

#Copying Specification folder to docker container
COPY ./specification /usr/src/prism/packages/cli/gp-connect-access-record-fhir/specification


#Running command of mock with OAS file
CMD ["mock" , "-h", "0.0.0.0", "-p" ,"9000" ,"gp-connect-access-record-fhir/specification/gp-connect-access-record-fhir.yaml"]
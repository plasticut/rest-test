#!/bin/bash
openssl genrsa -out certs/privatekey.pem 2048
openssl req -new -key certs/privatekey.pem -subj "/C=RU/ST=Moscow/L=Moscow/O=Dis/CN=test.com" -out certs/certrequest.csr
openssl x509 -req -in certs/certrequest.csr -signkey certs/privatekey.pem -out certs/certificate.pem
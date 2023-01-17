build:
	docker build -t gp-connect-mock-receiver -f Dockerfile ..

run: build
	docker run --rm -it -p 9000:9000 gp-connect-mock-receiver

.PHONY: build run
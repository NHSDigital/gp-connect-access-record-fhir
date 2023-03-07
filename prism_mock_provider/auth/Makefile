docker-build:
	docker build -t mock-provider-token-validation .

docker-run: docker-build
	docker run -it -e PORT=9000 -p 9000:9000 mock-provider-token-validation

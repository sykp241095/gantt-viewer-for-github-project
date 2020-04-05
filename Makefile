init:
	npm install --verbose

build:
	npm run ui:build

zip:
	rm -rf extension.zip; \
	cd chrome-ext; \
	zip -r ../extension.zip . -x *.map -x *.DS_Store;

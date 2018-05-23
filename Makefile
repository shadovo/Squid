
IMAGE_NAME=node:custom

run : build
	@echo "UNLEASH THE SQUID.."
	@xhost +
	@docker run -it \
		-v $$PWD:/project \
		-v $${PWD##*/}-node-modules:/project/node_modules \
		-v /etc/localtime:/etc/localtime:ro \
		-v /tmp/.X11-unix:/tmp/.X11-unix \
		-e "DISPLAY=unix$${DISPLAY}" \
		-e GDK_SCALE \
		-e GDK_DPI_SCALE \
		--device /dev/snd \
		--device /dev/dri \
		-w /project \
		${IMAGE_NAME} \
		sh -c "npm install && npm start"

build : Dockerfile 
	@docker build -t ${IMAGE_NAME} .

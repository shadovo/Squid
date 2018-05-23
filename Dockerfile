
FROM node:8

RUN	apt-get update && apt-get install -y \
	libx11-xcb1 \
	libxtst-dev \
	libasound2 \
	libgtk2.0-0 \
	libxss1 \
	libnss3 \
	libgconf-2-4 \
	--no-install-recommends \
	&& rm -rf /var/lib/apt/lists/*

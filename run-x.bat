docker build -t local-gogs .

docker run -it --name local-gogs -p 10880:22 -p 3000:3000 -v local-gogs-data:/data local-gogs
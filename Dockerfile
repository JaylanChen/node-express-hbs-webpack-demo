FROM node:lts-alpine

ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /usr/src/app

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "--"]

#docker 参数传入构建环境变量
ARG NODE_ENV
#设置容器内的环境变量
ENV NODE_ENV $NODE_ENV
#RUN npm install -g bower

#拷贝发布程序
ADD . /usr/src/app/
RUN npm config set registry=https://registry.npm.taobao.org
RUN npm install 
# RUN bower install
RUN npm run build

CMD [ "npm", "run", "server"]

EXPOSE 80

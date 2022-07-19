# FROM nginx

# MAINTAINER Ifeng@zhibodata.cn

# ENV TZ=Asia/Shanghai

# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# ADD /dist /dist


# CMD ["nginx", "-g", "daemon off;"]


# 设置基础镜像
FROM nginx:latest


EXPOSE 9527

WORKDIR /src

#COPY ../src /src

# 将dist文件中的内容复制到 /usr/share/nginx/html/ 这个目录下面
COPY dist/dev/  /usr/share/nginx/html/
# 用本地的 default.conf 配置来替换nginx镜像里的默认配置

COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM alpine:3.4 AS base
WORKDIR /build

FROM node:12.11.1 AS build
WORKDIR /
ARG REACT_APP_CI_ANALYTICS_TEST_MODE
ENV REACT_APP_CI_ANALYTICS_TEST_MODE=$REACT_APP_CI_ANALYTICS_TEST_MODE
ARG REACT_APP_CI_FAVICON
ENV REACT_APP_CI_FAVICON=$REACT_APP_CI_FAVICON
COPY . .
# RUN yarn config set registry https://registry.npmjs.org/
RUN yarn install
RUN yarn build

FROM base AS final
RUN apk add --update nginx && rm -rf /var/cache/apk/*
ADD nginx.conf /etc/nginx/nginx.conf
RUN mkdir /www-data
COPY --from=build /build /www-data
EXPOSE 80
CMD ["nginx"]
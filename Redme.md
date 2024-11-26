docker run --rm -it -v ${PWD}:/usr/src/app -v /usr/src/app/node_modules --env-file ${PWD}/.env.development -p 5501:5501 -e NODE_ENV=development auth-service:dev

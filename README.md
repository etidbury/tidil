
node /Users/edwardtidbury/Documents/Misc_Projects/tidil.git/index.js check-server --port-env TEST_SERVER_PORT

todo

ensure all commands resolve with process.exit



allow 'tidil open' to pass in an option --port-env DEV_SERVER_PORT
to override default environment variable used

add rm-locks command
add rm-pkg - removes client/server lock files and node_modules
add rm-pkg-locks/rm-locks-pkg - removes client/server lock files and node_modules

add a check-init command to be added in preinstall npm script

add command for grabbing file from github repo 
e.g. curl https://codeload.github.com/zeit/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/with-jest
curl -L https://github.com/etidbury/tpl-next-sails | tar zx /blob/master/README.md






init --tpl next-sails
(on preinstall of project etc.) Ensure variables setup, delete previous builds and pkgs, etc.



docker:reset
docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)

docker:rm
docker rm $(docker stop $(docker ps -a -q --filter ancestor=cra-sails --format=\"{{.ID}}\"))

docker:build
docker build -t cra-sails . --no-cache

docker:rmi
docker rmi cra-sails

docker:stop
docker rm $(docker stop $(docker ps -a -q --filter ancestor=cra-sails --format=\"{{.ID}}\"))

docker:run
docker run -p 127.0.0.1:3021:3005 -t cra-sails

docker:start
npm run docker:rmi ; npm run docker:stop ; docker build -t cra-sails . && npm run docker:run


docker:mysql
docker stop local-mysql-server ; docker rm local-mysql-server ; docker run --name local-mysql-server -p 3306:3306 -e MYSQL_ALLOW_EMPTY_PASSWORD=true -e MYSQL_DATABASE=cra-sails-local -e MYSQL_ROOT_HOST=% -d mysql/mysql-server:5.7 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci




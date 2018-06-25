todo

ensure all commands resolve with process.exit



allow 'tidil open' to pass in an option --port-env DEV_SERVER_PORT
to override default environment variable used

add rm-locks command
add rm-pkg - removes client/server lock files and node_modules
add rm-pkg-locks/rm-locks-pkg - removes client/server lock files and node_modules

add command for grabbing file from github repo 
e.g. curl https://codeload.github.com/zeit/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/with-jest
curl -L https://github.com/etidbury/tpl-next-sails | tar zx /blob/master/README.md

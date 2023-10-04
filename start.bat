call npm install
call .\node_modules\.bin\rollup -c
start /b node server.js
call .\node_modules\.bin\sirv public --no-clear --port 3000
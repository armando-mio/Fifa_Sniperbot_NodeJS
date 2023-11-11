HOW TO USE:

1) Close all the Chrome Tabs you've opened
2) Open a new terminal and digit the following command: cd C:\Program Files\Google\Chrome\Application && chrome -remote-debugging-port=9222
3) Open Chrome from the shortcut in the folder: "C:\Program Files\Google\Chrome\Application" and search: "http://localhost:9222/json/version" or "http://127.0.0.1:9222/json/version"
4) Save the value of the variable "webSocketDebuggerUrl" inside the 'nameofthefile.env' in the appropriate spot. It should look something like this: "ws://localhost:9222/devtools/browser/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" 


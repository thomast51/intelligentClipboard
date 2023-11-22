# intelligentClipboard

OCR web application (express.js) using a flask server with pytesseract.

WEB-rtc communications (the result of the OCR process) between two clients using peerjs.

## To launch the app localy
1.
 >Build of the node-express app image with the appropriate Dockerfile

`docker build ./appNode -t app_node_base`

2.
>Build of the Flask server image with the appropriate Dockerfile

`docker build ./srvFlask -t srv_flask_base`

3.
>Running the containers

`docker compose up -d`


## To host it free
1. Install ngrok
2. Configure the tunnel via the ngrok.yaml config file
3. Launch the tunnel via the command line `ngrok start <tunnel_name>`


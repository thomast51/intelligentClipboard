# intelligentClipboard

OCR web application (express.js) using a flask server with pytesseract.

WEB-rtc communications (the result of the OCR process) between two clients using peerjs.

## To launch the app in local
1.
 >Build de l'image de l'app node-express à l'aide du Dockerfile

`docker build ./appNode -t app_node_base`

2.
>Build de l'image du serveur Flask à l'aide du Dockerfile

`docker build ./srvFlask -t srv_flask_base`

3.
>Lancement des containers

`docker compose up -d`


## To host it free
1. Install ngrok
2. Configure the tunnel via the ngrok.yaml config file
3. Launch the tunnel via the command line `ngrok start <tunnel_name>`


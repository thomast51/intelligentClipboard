const express = require('express')
const path = require("path");
const bodyParser = require('body-parser');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');


const app = express()
const port = 3000


app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '35mb',
        parameterLimit: 500000,
    })
)
app.use(bodyParser.json({ limit: '35mb', parameterLimit:10000 }));
app.use(cors())
app.use('/assets',express.static(path.join(__dirname, 'public')))


app.listen(port)


const options = {
    root: path.join(__dirname)
}

// ===============================================
//Gestion des Routes pour l'affichage
app.get('/oneDScan', (req, res) => {
    res.sendFile('./views/oneDScan.html', options)
})

app.get('/twoDScan', (req, res) => {
    res.sendFile('./views/twoDScanHome.html', options)
})

app.get('/', (req, res)=>{
    res.sendFile('./views/index.html', options)
})

app.get('/help', (req, res)=>{
    res.sendFile('./views/help.html', options)
})


app.get('/send_scan/:peerid', (req, res)=>{
    /**
     * Route à paramètre qui avant de retourner la page html,
     * remplace une variable placée dans le code par le paramètre
     * de la route.
     */
    const receverId = req.params.peerid
    const htmlFile = "./views/twoScan.html"
    const template = fs.readFileSync(htmlFile, 'utf-8')
    if (receverId.length == 5){
        const html = template.replace('{{ receverId }}', receverId)
        res.send(html)
    }
    else{
        res.redirect(301, '/send_scan')
    }
})


app.get('/receive', (req, res)=>{
    res.sendFile('./views/receive.html', options)
})


app.get('/send_scan', (req, res)=>{
    res.sendFile('./views/twoScan.html', options)
})

app.get('/send_image',(req, res)=>{
    res.redirect(301, '/');
})


// Gestion des erreur 404, lorsque l'utilisateur entre une page qui n'existe pas on le redirige vers la page error.
app.get('*',(req, res)=>{
    res.sendFile("./views/error.html", options)
})

// =========================================================================



app.post('/send_image', async(req, res) => {
    /**
     * Route appelée après le submit d'un formulaire 
     * Elle reçoit une image, un paramètre de langue et l'identifiant de la page qui l'a appelée
     * Le tout est envoyé au serveur, qui retourne une réponse.
     * Cette réponse est envoyé à l'utilisateur dans un fichier html.
     * 
     * Parameters:
     *  - req : requête qui a appelé la route (Request)
     *  - res : réponse de la route (Response)
     */
    let resSrv=""
    const fromData = req.body
    const fData = new FormData()
    const pageRequest = fromData.page_info_input
    const receverId = fromData.receverId
    fData.append("img_data", fromData.img_datas)
    fData.append("langueOptions", fromData.langueOptions)

    await axios.post('http://serverFlask:5000/ocr', fData)
        /** 
         * Requête post vers le serveur flask, 
         * lui envoyant un Formdata contenant la langue et l'image à traiter
        */
        .then(response=>{
            resSrv = response.data
        })
        .catch(error =>{
            console.log("Error : " ,error)
        })
    
        // Réponse : ajoute la réponse du serveur au fichier html et l'envoie à l'utilisateur
        const htmlFile = pageRequest == "2" ? "./views/responseSrv.html" : "./views/responseSrvOne.html"
        const template = fs.readFileSync(htmlFile, 'utf-8')
        let html = template.replace('{{ data }}', resSrv)
        html = html.replace('{{ receverId }}', receverId)
        
        res.send(html)
})




app.post('/get-qr', async(req, res)=>{
    /**
     * Route post qui reçoit des données et les envoie au serveur qui lui génère un qrcode
     * à partir de ces données et le retourne en base 64. Les données sont ensuite renvoyées
     * du côté client toujour en base 64.
     */
    let resSrv=""
    const formData = new FormData()
    formData.append("qrcode-data", req.body.urlToPeerIdReceiver)
    await axios.post("http://serverFlask:5000/generate-qrcode", formData)
        .then(response=>{
            resSrv = response.data
        })
        .catch(error=>{
            res.send(error)
        })
    res.send(JSON.stringify(resSrv))
})
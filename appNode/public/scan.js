const vid = document.getElementById("vid")
const canvas_vid = document.getElementById("cnv-vid")
const btn_photo = document.getElementById("btn-photo")
const input_hidden = document.getElementById("img_datas")
const langSelect = document.getElementById("langueOptions")
const img = document.getElementById("img")
const file_recogn_btn = document.getElementById("file-recogn-btn")
const container_scan = document.getElementById("container-scan")
const divScan = document.querySelector(".container-form-scan")
const btnClick = document.getElementById("scan-start-btn")
const file_input_hidden = document.getElementById("file_img_datas")


const constraints={
    video:{
        width:{
            min:150,
            max: 900
        },
        height:{
            min:100,
            max:650
        },
        facingMode:"environment"
    }
}


document.getElementById("scan-start-btn").addEventListener("click", ()=>{
    /**
     * Fonction qui sur le clique du bouton "Scanner", capture le flux de la caméra
     * de l'utilisateur, et le place en tant que source d'un élément video html.
     * Si l'utilisateur ne possède pas de caméra, on lui envoie une alerte.
     */
    
    if (navigator.mediaDevices.getUserMedia) {
        // Place the webcam stream on the video element
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                vid.srcObject = stream

                // ========= Gestion de l'affichage ============
                divScan.classList.remove("invisible")
                btnClick.classList.add("invisible")
                file_recogn_btn.classList.add("invisible")
                container_scan.classList.remove("invisible")
                // =============================================
                
            })
            .catch(error => {
                console.log(error)
                alert("Pas de caméra valide")
            })
        
        vid.autoplay='true'
    }
})


file_recogn_btn.addEventListener("click", ()=>{
    /**
     * Fonction de gestion de l'affichage, elle gère le switch entre la page
     * du choix du scan fichier <-> caméra et les éléments de scan avec fichier.
     */
    file_recogn_btn.classList.add("invisible")
    divScan.classList.remove("invisible")
    btnClick.classList.add("invisible")
    canvas_vid.classList.add("invisible")
    file_input_hidden.classList.remove("invisible")
    btn_photo.classList.add("invisible")
    vid.classList.add("invisible")
    
})

file_input_hidden.addEventListener("change", (e)=>{
    /**
     * Fonction qui lorsque le contenu de l'input de type file "file_input_hidden"
     * change, va appeler la fonction pour sauvegarder le fichier image entré
     * par l'utilisateur.
     */
    saving_image(e)
    
})

const saving_image = async(e)=>{
    /**
     * Fonction prenant en paramètre un évènement, qui extrait le fichier
     * de cet évènement, converti l'image récupérée en base64 et la stocker
     * dans un input type hidden côté client.
     */
    const file = e.target.files[0]
    const b64 = await convertToB64(file)
    input_hidden.value= b64

    let image = new Image()
    image.onload = ()=>{
        const img_preview = document.getElementById("img_preview")
        img_preview.src=b64
    }
    image.src=b64
}


const convertToB64 = (file)=>{
    /**
     * Fonction prenant en paramètre un fichier (image) et le
     * convertissant en base64.
     */
    return new Promise((resolve, reject)=>{
        const fileReader = new FileReader()
        fileReader.readAsDataURL(file)

        fileReader.onload= () =>{
            resolve(fileReader.result)
        }

        fileReader.onerror = (error)=>{
            reject(error)
        }
    })
}



btn_photo.addEventListener("click", () => {
    /**
     * Fonction au clic du bouton pour prendre la photo,
     * affiche dans le canvas l'image actuelle de l'élément video
     */
    vid.style.display = "none"
    btn_photo.style.display = "none"
    canvas_vid.style.height="40vh"

    // Set l'obet canvas aux mêmes proportions que la video
    const image_width = vid.videoWidth
    const image_height = vid.videoHeight

    canvas_vid.width = image_width
    canvas_vid.height = image_height

    const context = canvas_vid.getContext('2d')
    // Place the current state of the video on the canvas
    context.drawImage(vid, 0, 0, image_width, image_height)

    const dataUrl = canvas_vid.toDataURL('image/png')
    input_hidden.value = dataUrl
})


document.getElementById("form-scan").addEventListener("submit", ()=>{
    /**
     * Fonction qui ajoute le loader à la page au submit du formulaire
     */
    
    const constainer_load = document.getElementById("load")
    constainer_load.classList.remove("invisible")
    constainer_load.classList.add("load")
})



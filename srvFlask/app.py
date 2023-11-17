from flask import Flask, request
import json, pytesseract, base64, io, cv2, numpy
from deskew import determine_skew
from skimage.transform import rotate
from PIL import Image
from spellchecker import SpellChecker
import qrcode
from functools import cache, lru_cache


app= Flask(__name__)

@app.route("/")
def home():
    return "<h1>Welcome to the server</h1>"

@app.route("/ocr", methods=["POST"])
def receive_ocr():
    '''
    Fonction de la route post /ocr recevant une image en base64
    et retournat le texte extrait de cette image
    
    Return:
        résultat de la reconnaissance de texte (string)
    '''
    if request.method== 'POST':
        img_data = request.form.get("img_data")
        lang = request.form.get("langueOptions")
        return text_recognition(img_data, lang)

@lru_cache(maxsize=256)
def text_recognition(img, langue):
    '''
    Fonction de reconnaissance du texte retournant le texte extrait d'une image

    Parameters:
        img : image en base64 contenant le texte à extraire (base64)
        langue : langue du texte de l'image (string)
    
    Return:
        final_string : le texte extrait de l'image (string)
    '''
    
    config = (f'-l {langue}')

    url_img = img.split(',')
    img_format = io.BytesIO(base64.b64decode(url_img[1]))
    img_to_recogn = Image.open(img_format)
    threshold_img = format_img(img_to_recogn)
    deskewd_img = deskew_img(threshold_img)
    
    result_brut = pytesseract.image_to_string(deskewd_img, config=config)

    if langue == "eng":
        spellchecker = SpellChecker()
    elif langue == "fra":
        spellchecker = SpellChecker(language='fr')
    elif langue == "deu":
        spellchecker = SpellChecker(language='de')

    words = check_words(result_brut, spellchecker)

    final_string = " ".join(str(item) for item in words)

    return final_string
    


def format_img(img):
    '''
    Fonction qui formate une image pour une optimisation de l'extraction du texte

    Parameters:
        img : image à filter (image object)
    
    Return:
        threshold_img : tuple contenant l'image et la valeur de threshold (tuple)
    '''
    nuArrImg = numpy.array(img)
    gray = cv2.cvtColor(nuArrImg, cv2.COLOR_BGR2GRAY)
    threshold_img = cv2.threshold(gray, 120, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    return threshold_img



def check_words(result_brut, spellchecker):
    '''
    Fonction parcourant le résultat de l'OCR et décidant quel mot doit
    être orthographiquement contrôlé
    Parameters:
        result_brut : mots à corriger (string)
        spellchecker : dictionnaire de la librairie pyspellchecker (constructor)
    
    Return:
        words : liste de chaque mot corrigé (string)
    '''
    words = []
    words = result_brut.split(" ")

    for w in words:
        if len(w) >1 and w.lower() == w:
            corr_w = spell_checker(w, spellchecker)
            if(corr_w != w and corr_w is not None):
                idx_w = words.index(w)
                words[idx_w] = corr_w
    return words



def spell_checker(word, spellchecker):
    '''
    Fonction controllant l'orthographe d'un mot 
    passé en paramètre et retournant une correction éventuelle.

    Parameters:
        word : mot à corriger (string)
        spellchecker : dictionnaire de la librairie pyspellchecker (constructor)
    
    Return:
        word : le mot si correcte (string)
        corr : la correction si le mot est incorrect (string)
    '''
    if word in spellchecker:
        return word
    else:
        corr = spellchecker.correction(word)
        return corr




def deskew_img(img):
    '''
    Fonction qui recadre l'image pour améliorer l'éfficacité 
    de la reconnaissance de texte

    Parameters:
        img : image à filter (image object)
    
    Return:
        deskew_img : l'image recadrée (tuple)
    '''
    angle = determine_skew(img)
    rotated = rotate(img, angle, resize=True) * 255
    deskew_img = rotated.astype(numpy.uint8)
    return deskew_img


@app.route("/generate-qrcode", methods=["POST"])
def generating_qrcode():
    '''
    Fonction de la route post /generate-qrcode.
    Elle génère un qrcode contenant les données 
    envoyées par la route, et le retourne converti en base64.

    Return:
        Le Qr-code en base64 (string)
    '''
    if request.method == 'POST':
        qrcode_data = request.form.get("qrcode-data")
        qr = qrcode.make(qrcode_data)
        pil_img = qr.get_image()
        buffered = io.BytesIO()
        pil_img.save(buffered, format="JPEG")
        b64_qr = base64.b64encode(buffered.getvalue()).decode()

        return b64_qr
        






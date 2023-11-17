FROM python:3.11.5
RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-deu tesseract-ocr-fra tesseract-ocr-ita 
RUN apt-get install ffmpeg libsm6 libxext6 -y
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
WORKDIR /app
COPY requirements.txt requirements.txt
RUN pip install --upgrade pip && pip3 install -r requirements.txt
COPY . /app
EXPOSE 5000
CMD ["python3", "-m","flask","run"]
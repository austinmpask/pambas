FROM python:3.12-alpine3.18

WORKDIR /app
COPY . /app
RUN pip install -r requirements.txt

ENV FLASK_APP=flaskr
ENV FLASK_DEBUG=1

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
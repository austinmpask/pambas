from flaskr import createApp
from flask import request

app = createApp()


@app.route("/")
def index():
    return {"msg": "it worked", "service": "api"}


if __name__ == "__main__":
    app.run(debug=True)

from flaskr import createApp

app = createApp()


@app.route("/")
def index():
    return "rootroute"


@app.route("/test")
def test():
    return "testroute"


if __name__ == "__main__":
    app.run(debug=True)

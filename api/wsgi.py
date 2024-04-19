from flaskr import createApp

app = createApp()


@app.route("/")
def index():
    return "it worked (USERS)"


if __name__ == "__main__":
    app.run(debug=True)

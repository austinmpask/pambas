from flaskr import createApp

app = createApp()


@app.route("/users/")
def index():
    return "it worked (USERS)"


if __name__ == "__main__":
    app.run(debug=True)

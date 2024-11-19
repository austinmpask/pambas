from flaskr import createApp
import os

app = createApp()


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_ENV", "False") == "True")

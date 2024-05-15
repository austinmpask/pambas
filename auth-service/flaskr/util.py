from flask import jsonify


# Simplify sending responses
def sendJsonResponse(app, code, message, error=None):
    okCodes = {200, 201, 204}

    status = "Success" if code in okCodes else "Error"
    trace = str(error) if error else "None"
    with app.app_context():
        return (
            jsonify(
                {"code": code, "status": status, "message": message, "trace": trace}
            ),
            code,
        )

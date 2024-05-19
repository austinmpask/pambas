from flask import jsonify


# Simplify sending responses
def sendJsonResponse(code, message, error=None):
    okCodes = {200, 201}

    status = "Success" if code in okCodes else "Error"
    trace = str(error) if error else "None"

    return (
        jsonify({"code": code, "status": status, "message": message, "trace": trace}),
        code,
    )

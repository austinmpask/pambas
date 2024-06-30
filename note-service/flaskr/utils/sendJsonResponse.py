from flask import jsonify


# Simplify sending responses
def sendJsonResponse(code, message):
    okCodes = {200, 201}

    ok = True if code in okCodes else False

    return jsonify({"code": code, "ok": ok, "message": message})

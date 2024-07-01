from flask import jsonify


# Simplify sending responses
def sendJsonResponse(status, message):

    return jsonify({"status": status, "message": message}), status

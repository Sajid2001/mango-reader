from flask import Blueprint, jsonify

hello = Blueprint('hello', __name__)

@hello.route('/hello', methods=['GET'])
def hello_world():
    return jsonify({'message': 'hello'})

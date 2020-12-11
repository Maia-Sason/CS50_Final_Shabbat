from flask import Flask, render_template, redirect, flash, jsonify, request
from flask_login import LoginManager, login_user, current_user, login_required, logout_user

from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = Flask(__name__)

# Configure flask login

# login = LoginManager(app)
# login.init_app(app)

# create secret key to keep client session secure, cookies during sess
app.secret_key = 'secret'

# Instantiate Flask-socket io and pass in app.
socketio = SocketIO(app)

@app.route('/create-room', methods=['GET', 'POST'])
def index():
    room_exist = False
    if (request.method == "GET") and (room_exist == False):
        # create a multistep form
        return render_template('create-room.html')

    elif room_exist == True:
        return render_template('roomCreated.html')
    
    elif request.method == "POST":

        roomName = request.form.get("roomName")
        roomDate = request.form.get("dateTimehtml")
        roomList = request.form.get("blessBlocks")

        return render_template('roomCreated.html', roomName=roomName)

    



if __name__ == '__main__':
    app.run(debug=True)
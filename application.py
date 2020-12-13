from flask import Flask, render_template, redirect, flash, jsonify, request
from flask_login import LoginManager, login_user, current_user, login_required, logout_user

from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = Flask(__name__)

# Configure flask login

# login = LoginManager(app)
# login.init_app(app)

# sessions (for guest accounts)

# create secret key to keep client session secure, cookies during sess
app.secret_key = 'secret'

# Instantiate Flask-socket io and pass in app.
socketio = SocketIO(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    ''' Join a room here. '''

    if (request.method == "GET"):
        # If user is logged in:
        # else:
        return render_template('index.html')
    else:
        # If user logged in... Display name = user display name
        # else

        displayName = request.get("guestName")

        roomCode = request.get("code")

        # if roomCode == some room code in the db:
            # if roomCode == a room code that also matches the host:
                # return error "you cant join your own room as a guest"
            # return render template room-joined, pass code, pass Displayname
            # return error "that room does not exist"

@app.route('/login', methods=["GET", "POST"])
def login():
    ''' Login page ''' 

    # Get user to log in.
    # pull up info from db

@app.route('/register', methods=["GET", "POST"])
def register():
    ''' Sign User up '''

    # Get user to sign up and store info in db

@app.route('/room-library', methods=["GET", "POST"])
@login_required
def roomLibrary():
    ''' You can view all the rooms you own here  ((LIMIT 10/user))'''
    # load all existing rooms for user

    # button to add a new room

    # give ability to delete a room off the page.


@app.route("/bless-library", methods=["GET", "POST"])
def blessLibrary():
    ''' You can view all of the blessings you have here '''
    # load preset bless blocks from database

    # load custom bless blocks from data base

    # give ability to delete a custom blessing off the page


@app.route('/create-bless', methods=["GET", "POST"])
def createBless():
    ''' Create a new bless block here '''

    # if get:
        # render page with multistep form
    # else:
        # blessName = request.form.get("blessName")
        # blessEng = request.form.get("blessEng")
        # blessHeb = request.form.get("blessHeb")
        # blessHeb-Eng = request.form.get("blessHeb-Eng")
        # blessMeaning = request.form.get("blessMeaning")

        # store it all in a database
    


@app.route('/create-room', methods=['GET', 'POST'])
def createRoom():
    ''' Create a room '''
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


# Set up sockets.

@app.route('/room-joined', methods=['GET','POST'])
def roomJoined():
    ''' Join the room as guest or host '''
    # if joined with host id:
        # load up host privledges
        # render template pass host, room settings
    # if joined with room code:
        # load up guest access
        # render privledges pass guest, room settings

    # connect to sockets here i think


if __name__ == '__main__':
    app.run(debug=True)
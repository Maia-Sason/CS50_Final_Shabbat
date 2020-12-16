from datetime import datetime

from helper import *

import json

from sqlalchemy.orm import relationship
from flask import Flask, render_template, redirect, flash, jsonify, request
from flask_login import LoginManager, login_user, current_user, login_required, logout_user

from flask_socketio import SocketIO, send, emit, join_room, leave_room

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure flask login

# Configure flask login
login = LoginManager(app)
login.init_app(app)

# config sqlalchemy
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    display_name = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(50))
    phash = db.Column(db.String)
    rooms = db.relationship('Room', backref='author', lazy=True)
    blessings = db.relationship('Bless', backref='author', lazy=True)

    def __init__(self, display_name, email, phash):
        self.name = display_name
        self.email = email
        self.phash = phash

    

class Bless(db.Model):
    __tablename__ = 'bless'
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    bless_name = db.Column(db.String(30))
    eng = db.Column(db.String)
    heb = db.Column(db.String)
    eng_heb = db.Column(db.String)
    meaning = db.Column(db.String)

    def __init__(self, bless_name, eng, heb, eng_heb, meaning):
        self.name = bless_name
        self.eng = eng
        self.heb = heb
        self.eng_heb = eng_heb
        self.meaning = meaning

class Room(db.Model):
    __tablename__ = 'room'
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    room_code = db.Column(db.Integer, unique=True)
    room_name = db.Column(db.String(30))

    # room_time = db.Column(db.DateTime)


    # def __init__(self, room_code, room_name, user_id):
    #     self.code = room_code
    #     self.name = room_name
    #     self.user_id = user_id

class Room_Bless(db.Model):
    __tablename__ = 'room_bless'
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"))
    bless_id = db.Column(db.Integer, db.ForeignKey("bless.id"))
    ord_num = db.Column(db.Integer)
    id = db.Column(db.Integer, primary_key=True)
    
    
    # def __init__(self, ord_num, bless_id, room_id):
    #     self.room_id = room_id
    #     self.bless_id = bless_id
    #     self.orderer = ord_num


# class room_join(db.Model):
#     room_id = db.Column(db.Integer, db.ForeignKey("Room.room_id"))
#     user_id = db.Column(db.Integer, db.ForeignKey("User.user_id"))


db.create_all()
db.session.commit()

# sessions (for guest accounts)

# create secret key to keep client session secure, cookies during sess
app.secret_key = 'secret'

# Instantiate Flask-socket io and pass in app.
socketio = SocketIO(app)

@login.user_loader
def load_user(user_id):
    return User.get(user_id)


@app.route('/', methods=['GET', 'POST'])
def index():
    ''' Join a room here. '''

    if (request.method == "GET"):
        # If user is logged in:
        # else:
        return render_template('index.html', )
    else:
        # If user logged in... Display name = user display name
        # else

        displayName = request.form.get("guestName")

        roomCode = request.form.get("code")

        foundRoom = Room.query.filter_by(code=roomCode).first()
        if foundRoom == None:
            return render_template("error.html")
        else:
            # if roomCode == a room code that also matches the host:
                # return error "you cant join your own room as a guest"
            return render_template("room_join.html", roomCode=roomCode, displayName=displayName)
            # return render template room-joined, pass code, pass Displayname
            # return error "that room does not exist"

@app.route('/login', methods=["GET", "POST"])
def login():
    ''' Login page ''' 
    if request.method == "GET":
        return render_template("login.html")
    else:
        email = request.form.get("email")
        password = request.form.get("password")

    

   
    # user_object = User.query.filter_by(email=email).first()
    # if user_object is None:
        # error
    # elif password != user_object.password:
        # error
    # else:
        # if everything is correct:
        # login_user(user_object)


        
    # Get user to log in.
    # pull up info from db

@app.route('/register', methods=["GET", "POST"])
def register():
    ''' Sign User up '''
    if request.method == "GET":
        return render_template("register.html")
    else:
        return render_template('login.html')

    # Get user to sign up and store info in db

# that was weird... this refused to work for awhile until i checked
# it on google chrome
@app.route('/_check_email')
def check_mail():
    # solution from
    # URL: https://stackoverflow.com/questions/15438524/object20object-validation-plugin-flask

    email = request.args.get('email')
    check = User.query.filter_by(email=email).first()
    if check == None:
        checker = "true"
    else:
        checker = "false"
    return checker
    


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
    room_exist = 0
    if (request.method == "GET") and (room_exist < 10):
        # create a multistep form
        return render_template('create-room.html')

    elif room_exist >= 10:
        return render_template('error.html')
    
    elif request.method == "POST":

        data = request.get_json()
        if data != None:
            datadict = json.dumps(data)
            roomdict = json.loads(datadict)

            print(roomdict["rlist"][0])
            

            go = True
            
            while go:
                roomCode = get_rndm(6)
                code = Room.query.filter_by(room_code=roomCode).first()
                if roomCode != code:
                    go = False
           
            room = Room(room_name=roomdict['rname'], room_code=roomCode, user_id=1)
            db.session.add(room)
            db.session.commit()


       
            
            for i in range(len(roomdict["rlist"])):
                print(i)
                j = i
                j = Room_Bless(bless_id=roomdict['rlist'][i],ord_num=(1+i), room_id=room.id)
                
                db.session.add(j)
                db.session.commit()
        return render_template('roomCreated.html')


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
from datetime import datetime

from helper import *

import json

from sqlalchemy.orm import relationship
from flask import Flask, render_template, redirect, flash, jsonify, request
from flask_login import LoginManager, login_user, current_user, login_required, logout_user, UserMixin
from passlib.hash import pbkdf2_sha256

from datetime import datetime


from flask_socketio import SocketIO, send, emit, join_room, leave_room

from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)



# Configure flask login

# Configure flask login
login = LoginManager(app)
login.init_app(app)

# config sqlalchemy
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

# Set up classes for db
class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    display_name = db.Column(db.String(50), unique=False)
    email = db.Column(db.String(50), unique=True)
    phash = db.Column(db.String)
    rooms = db.relationship('Room', backref='author', lazy=True)
    blessings = db.relationship('Bless', backref='author', lazy=True)

    def __init__(self, display_name, email, phash):
        self.display_name = display_name
        self.email = email
        self.phash = phash

    

class Bless(db.Model):
    __tablename__ = 'bless'
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    id = db.Column(db.Integer, primary_key=True)
    bless_name = db.Column(db.String(30))
    eng = db.Column(db.String)
    heb = db.Column(db.String)
    eng_heb = db.Column(db.String)
    meaning = db.Column(db.String)

    def __init__(self, bless_name, eng, heb, eng_heb, meaning,user_id):
        self.bless_name = bless_name
        self.eng = eng
        self.heb = heb
        self.eng_heb = eng_heb
        self.meaning = meaning
        self.user_id = user_id

class Room(db.Model):
    __tablename__ = 'room'
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    id = db.Column(db.Integer, primary_key=True)
    room_code = db.Column(db.String, unique=True)
    room_name = db.Column(db.String(30))
    
    room_time = db.Column(db.DateTime)

class Room_Bless(db.Model):
    __tablename__ = 'room_bless'
    room_id = db.Column(db.Integer, db.ForeignKey("room.id"), nullable=False)
    bless_id = db.Column(db.Integer, db.ForeignKey("bless.id"))
    ord_num = db.Column(db.Integer)
    id = db.Column(db.Integer, primary_key=True)
    
    
    # def __init__(self, ord_num, bless_id, room_id):
    #     self.room_id = room_id
    #     self.bless_id = bless_id
    #     self.ord_num = ord_num
    #     self.id =

db.create_all()
db.session.commit()

# create secret key to keep client session secure, cookies during sess
app.secret_key = ('SECRET_KEY')

# Instantiate Flask-socket io and pass in app.
socketio = SocketIO(app, cors_allowed_origins="*")

@login.user_loader
def load_user(id):
    # Get user's id
    return User.query.get(int(id))



@app.route('/', methods=['GET', 'POST'])
def index():
    ''' Join a room here. '''

    if request.method == "GET":
        return render_template('index.html' )
    elif request.method == "POST":
       
        # If user is anon, this will be their display Name
        displayName = request.form.get("guestName")

        # Get room code
        roomCode = request.form.get("code")

        # get room from room_code
        foundRoom = Room.query.filter_by(room_code=roomCode).first()

        # if there was no room
        if foundRoom == None:
            return apology("Room not found!")

        # If the user is logged in, set their display name to the display name in db
        if current_user.is_authenticated:
            displayName = current_user.display_name
           
            # if foundroom's user_id is the current user's id, apologize
            if foundRoom.user_id == current_user.id:
                return apology("You can't join your own room as a guest!")
        
        # tell program that user is a guest not a host
        mode = 'guest'

        # Collect all info for blessings for this room.
        blessID = Bless.query.filter_by(id=Room_Bless.bless_id)\
            .join(Room_Bless).filter_by(room_id=foundRoom.id).order_by(Room_Bless.ord_num.asc())
        for bless in blessID:

            print(f' {bless.bless_name} hi')

        return render_template("room_join.html", room=foundRoom, displayName=displayName, mode=mode, blessID=blessID)


@app.route('/login', methods=["GET", "POST"])
def login():
    ''' Login page ''' 
    if request.method == "GET":
        return render_template("login.html")
    else:
        email = request.form.get("email")
        password = request.form.get("password")

        # find user email
        user_log = User.query.filter_by(email=email).first()
        if user_log == None:
            # If email doesn't exist in db: return apology
            return apology("Invalid email/password.")
        # DONT FORGET TO HASH THE PASSWORD!
        if pbkdf2_sha256.verify(password, user_log.phash) and user_log.email == email:
            # If user password and email match: log in user
            login_user(user_log)
            return render_template("index.html")
        # Else apologize
        return apology("Invalid email/password.")


@app.route('/logout')
@login_required
def logout():
    logout_user()
    # Logs out user, and redirects to login.
    return render_template('login.html')

@app.route('/register', methods=["GET", "POST"])
def register():
    ''' Sign User up '''
    if request.method == "GET":
        return render_template("register.html")
    else:
        email = request.form.get('email')
        display_name = request.form.get('display_name')
        password = request.form.get('password')

        hashed_pswd = pbkdf2_sha256.hash(password)

        print(display_name)

        # DONT FORGET TO hash password and store all in db
        new = User(email=email, display_name=display_name, phash=hashed_pswd)
        db.session.add(new)
        db.session.commit()

        return render_template('login.html')


# that was weird... this refused to work for awhile until i checked
# it on google chrome
@app.route('/_check_email')
def check_mail():
    # Solution from
    # URL: https://stackoverflow.com/questions/15438524/object20object-validation-plugin-flask

    # Get email from validation remote
    email = request.args.get('email')
    # Check to see if email exists
    check = User.query.filter_by(email=email).first()
    if check == None:
        checker = "true"
    else:
        checker = "false"
    print(email)
    print(check)
    # return true or false for js
    return checker


@app.route('/room-library', methods=["GET", "POST"])
@login_required
def roomLibrary():
    ''' You can view all the rooms you own here  ((LIMIT 10/user))'''
    if request.method == "GET":
        # load all existing rooms for user
        user_rooms = Room.query.filter_by(user_id=current_user.get_id()).all()


        # DONT FORGET TO give ability to delete a room off the page.

        return render_template("room-library.html", user_rooms = user_rooms, len = len)
    else:
        # # Probably change this.
        # # mode to host
        room_id = request.form.get("room-id")
        print(f'this is the id: {room_id} ')
        # print(room_id)
        mode = 'host'
        # # room to whatever room was in the form
      

        # gather room info and bless info
        displayName = current_user.display_name
        room = Room.query.filter_by(id=room_id).first()
        blessID = Bless.query.filter_by(id=Room_Bless.bless_id)\
            .join(Room_Bless).filter_by(room_id=room.id).order_by(Room_Bless.ord_num.asc())

        return render_template("room_join.html", room=room, displayName=displayName, mode=mode, blessID=blessID)
        return apology("We couldn't connect you to your room!")

@app.route('/_load_bless_list')
def load_bless_list():
    userBless = current_user.blessings
    genBless = Bless.query.filter_by(user_id=None).all()
    allBless = genBless + userBless

    blessList = []

    for bless in allBless:
        blessitems = {'id' : bless.id, 'name': bless.bless_name}
        blessList.append(blessitems)

    return json.dumps(blessList)



@app.route('/_load_room_settings', methods=['POST'])
def load_room():

    data = request.get_json()

    room = Room.query.filter_by(id=data['room_id']).first()

    roomDict = {
        'name' : room.room_name,
        'code' : room.room_code,
        'date' : room.room_time,
        'id' : room.id
    }

    return roomDict

@app.route('/_delete_room', methods=['post'])
def delete_room():
    
    data = request.get_json()

    # datadict = json.dumps(data)
    # roomdict = json.loads(datadict)

 
    room_delete = Room.query.filter_by(id = data['room_id']).first()
   
    bless_room = Room_Bless.__table__.delete().where(Room_Bless.room_id == data['room_id'])

    db.session.execute(bless_room)
    db.session.delete(room_delete)
    db.session.commit()

    return render_template('room-library.html')

@app.route('/_load_bless_settings', methods=['POST'])
def load_bless():
    if request.method == 'POST':
        data = request.get_json()

        bless = Bless.query.filter_by(id=data['bless_id']).first()

        print(data)

        blockDict = {
            'name' : bless.bless_name,
            'hebrew' : bless.heb,
            'english' : bless.eng,
            'transliteration' : bless.eng_heb,
            'meaning' : bless.meaning
        }

        return blockDict


@app.route('/_add_bless_guest', methods=['POST'])
def add_bless_guest():
    data = request.get_json()

    print(data)

    for item in data:
        copy = Bless.query.filter_by(id=item).first()
        print(copy)

        newbless = Bless(bless_name=copy.bless_name, eng=copy.eng, heb=copy.heb, eng_heb=copy.eng_heb, meaning=copy.meaning, user_id=current_user.get_id())
        db.session.add(newbless)
    db.session.commit()

    return render_template('index.html')

        

@app.route("/bless-library", methods=["GET", "POST"])
def blessLibrary():
    ''' You can view all of the blessings you have here '''
    userBless = current_user.blessings
    genBless = Bless.query.filter_by(user_id=None).all()
    allBless = genBless + userBless
    # load preset bless blocks from database

    # load custom bless blocks from data base

    # give ability to delete a custom blessing off the page
    return render_template('bless-library.html', genBless=genBless, userBless=userBless)


@app.route('/_create_bless', methods=["POST"])
def createBless():
    ''' Create a new bless block here '''
    data = request.get_json()

    newbless = Bless(bless_name=data['bname'], eng=data['beng'], heb=data['bheb'], eng_heb=data['beng_heb'], meaning=data['bmeaning'], user_id=current_user.get_id())
    db.session.add(newbless)
    db.session.commit()

    return redirect('/bless-library')


    # store it all in a database

@app.route('/_delete_bless', methods=['POST'])
def delete_bless():
    data = request.get_json()

    bless = Bless.query.filter_by(id=data['bless_id']).first()

    db.session.delete(bless)
    db.session.commit()

    return redirect('/bless-library')

    


@app.route('/create-room', methods=['GET', 'POST'])
@login_required
def createRoom():
    ''' Create a room '''
    # get how many rooms user has
    room_exist = Room.query.filter_by(user_id=current_user.get_id()).all()
    if (request.method == "GET"):
        # If amount of rooms is == or exceeds 10, return apology
        if len(room_exist) >= 10:
            return apology("No more than 10 active rooms supported.")

        # Gather blessings to be displayed
        userBless = current_user.blessings
        genBless = Bless.query.filter_by(user_id=None).all()
        allBless = genBless + userBless
        # create a multistep form
        return render_template('create-room.html', allBless=allBless)

    elif request.method == "POST":
        # Get data from json AJAX call
        data = request.get_json()

        
        # set this to true
        go = True
        
        # While go is true, create a room code, if room code doesn't exist, break out
        # and set roomCode as the code of the new room
        while go:
            roomCode = get_rndm(6)
            code = Room.query.filter_by(room_code=roomCode).first()
            if roomCode != code:
                go = False
        
        # DONT FORGET: to add date and time to DB

        room = Room(room_name=roomdict['rname'], room_code=roomCode, user_id=current_user.get_id())
        db.session.add(room)
        db.session.commit()

        # Go through the list of prayers, and add each one to the Room_Bless table
        for i in range(len(roomdict["rlist"])):
            print(i)
            j = i
            j = Room_Bless(bless_id=roomdict['rlist'][i],ord_num=(1+i), room_id=room.id)
            
            db.session.add(j)
            db.session.commit()
        return render_template('roomCreated.html')

@app.route('/_create_room', methods=['POST'])
@login_required
def createRoom_post():
    ''' Create a room '''
    room_exist = Room.query.filter_by(user_id=current_user.get_id()).all()
    if len(room_exist) < 10:
        # Get data from json AJAX call
        data = request.get_json()
            
        # Catch data before it is sent again as None
        datadict = json.dumps(data)
        roomdict = json.loads(datadict)


        # URL: https://stackoverflow.com/questions/5045210/how-to-remove-unconverted-data-from-a-python-datetime-object
        end_date = roomdict["rdate"]
        chop = len(end_date.split()[-1]) - 15
        end_date = end_date[:-chop]

        print('enddate ' + end_date)

        date = datetime.strptime(end_date, '%Y-%m-%dT%H:%M')
        # print(date)
        
        # set this to true
        go = True
        
        # While go is true, create a room code, if room code doesn't exist, break out
        # and set roomCode as the code of the new room
        while go:
            roomCode = get_rndm(6)
            code = Room.query.filter_by(room_code=roomCode).first()
            if roomCode != code:
                go = False
        
        # DONT FORGET: to add date and time to DB
        
        room = Room(room_name=roomdict['rname'], room_time=date, room_code=roomCode, user_id=current_user.get_id())
        db.session.add(room)
        db.session.commit()

        # Go through the list of prayers, and add each one to the Room_Bless table
        for i in range(len(roomdict["rlist"])):
            print(i)
            j = i
            j = Room_Bless(bless_id=roomdict['rlist'][i],ord_num=(1+i), room_id=room.id)
            
            db.session.add(j)
            db.session.commit()
    return render_template('room-library.html')

# Set up sockets.

@app.route('/room_join', methods=['GET','POST'])
def roomJoined():
    ''' Join the room as guest or host '''
    if request.method == 'GET': 
        return render_template('room_join.html')
    # connect to sockets here i think

@socketio.on('join')
def join(data):
    print(data)
    join_room(data["room"])

    send({'msg': data['displayName'] + " has joined the room."}, room=data['room'])

@socketio.on('message')
def message(data):
    # Take data, then print it to the console for debugging
    # then send the data and broadcast it to every single user
    # connected.

    print(f'\n\n{data}\n\n')
    send(data, room=data['room'])

@socketio.on('button_press')
def button(msg):
    print(f'\n\nThis is the data: {msg}\n\n')
    emit('button_press', msg['color'])

@socketio.on('start')
def start(data):
    print(f'\n\nThis is the start: {data}\n\n')
    emit('start', data, room=data['room'])

@socketio.on('bless')
def bless(data):
    print(f'\n\nThis is the bless: {data}\n\n')
    blessing = Bless.query.filter_by(id=data['id']).first()
    current_bless = {'name' : blessing.bless_name,
                    'english' : blessing.eng,
                    'hebrew' : blessing.heb,
                    'eng_heb' : blessing.eng_heb,
                    'meaning' : blessing.meaning}
    emit('bless', current_bless, room=data['room'])

@socketio.on('ending')
def ended(data):
    '''end session and send bless'''
    # open room_bless where room_bless.roomid == roomid
    #  and room_bless.bless_id == Bless.user_id
    bless_in_room = Room_Bless.query.filter_by(room_id = data['room']).all()
    
    blessList = []

    print(bless_in_room)
    for item in bless_in_room:
        bless = Bless.query.filter_by(id = item.bless_id).first()
        if bless.user_id != None:
            blessitems = {'id' : bless.id, 'name': bless.bless_name}
            blessList.append(blessitems)

    print(f'new list {blessList}')

    emit('ending', blessList, room=data['room'])

    room_delete = Room.query.filter_by(id = data['room']).first()
   
    bless_room = Room_Bless.__table__.delete().where(Room_Bless.room_id == data['room'])

    db.session.execute(bless_room)
    db.session.delete(room_delete)
    db.session.commit()


    # where bless.user_id != NULL

    # make a dict with the data

    # then delete room where room_id == data.room, and also room_bless

    # send dict back to users
    


if __name__ == '__main__':
    app.run()
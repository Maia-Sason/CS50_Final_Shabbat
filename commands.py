# url: https://www.youtube.com/watch?v=FKy21FnjKS0
# create tables command
import click
from flask.cli import with_appcontext

from application import db, User, Bless, Room, Room_bless

db.create_all()
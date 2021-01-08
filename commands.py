# url: https://www.youtube.com/watch?v=FKy21FnjKS0
# create tables command
import click
from flask.cli import with_appcontext

from application import db, User, Bless, Room, Room_bless

@click.command(name='create_tables')
@with_appcontext
def create_tables():
    db.create_all()
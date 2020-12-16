# https://pynative.com/python-generate-random-string/
import random
import string

import os
import requests
import urllib.parse

from flask import redirect, render_template, request, session
from functools import wraps

def get_rndm(length):
    letters = string.ascii_letters
    result = ''.join(random.choice(letters) for i in range(length))
    return result.upper()

def apology(message, code=400):
    """Render message as an apology to user."""
    def escape(s):
        """
        Escape special characters.
        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [("-", "--"), (" ", "-"), ("_", "__"), ("?", "~q"),
                         ("%", "~p"), ("#", "~h"), ("/", "~s"), ("\"", "''")]:
            s = s.replace(old, new)
        return s
    return render_template("apology.html", top=code, bottom=escape(message)), code
# https://pynative.com/python-generate-random-string/
import random
import string

def get_rndm(length):
    letters = string.ascii_letters
    result = ''.join(random.choice(letters) for i in range(length))
    return result.upper()
import random
import string

def generate_id(prefix='M-'):
    """ Generate a unique prefixed 12-character alphanumeric ID """
    characters = string.ascii_letters + string.digits
    random_id = prefix + ''.join(random.choice(characters) for _ in range(12))
    return random_id

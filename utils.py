import random
import string

def generate_id():
    return 'M-' + ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(12))

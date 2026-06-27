from rembg import remove, new_session

session = None

def get_session():
    global session
    if session is None:
        session = new_session("u2netp")
    return session

def remove_background_bytes(image_bytes):
    return remove(image_bytes, session=get_session())
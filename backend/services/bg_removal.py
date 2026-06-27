session = None

def get_session():
    global session

    if session is None:
        from rembg import new_session
        session = new_session("u2netp")

    return session


def remove_background_bytes(image_bytes):
    from rembg import remove

    return remove(
        image_bytes,
        session=get_session()
    )
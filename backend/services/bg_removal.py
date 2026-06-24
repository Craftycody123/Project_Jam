from rembg import remove, new_session

session = new_session("u2netp")

def remove_background_bytes(image_bytes: bytes) -> bytes:
    output = remove(
        image_bytes,
        session=session
    )

    return output
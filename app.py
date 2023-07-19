import cv2
from cvzone.HandTrackingModule import HandDetector
from flask import Flask, jsonify
from waitress import serve
from threading import Thread
import time
import base64

app = Flask(__name__, static_url_path='', static_folder='.')

# MediaPipe hand detector object
detector = HandDetector()

# Current video frame captured from web camera
frame = None

# Number of fingers that user shows on current video frame
fingers = None

def main():
    # Run camera frames capture in a background thread
    thread = Thread(target=run_camera)
    thread.start()

    # Run web service in a main thread
    serve(app, port=8080)


@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/frame')
def frame():
    """
    /frame HTTP endpoint returns JSON object with
    current video frame from web camera as data url
    and number of fingers that user shows
    """
    if frame is None:
        return "{}"
    retval, buffer = cv2.imencode('.jpg', frame)
    data_url = "data:image/png;base64,"+base64.b64encode(buffer).decode("utf-8")
    return jsonify({"frame": data_url, "fingers": str(fingers)})


def run_camera():
    """
    Function captures video frame from web camera every
    30 ms as OpenCV image, detects if user shows hand and
    detects number of fingers showed.
    Stores current video frame image and number of fingers
    to the global variables
    """

    global frame, fingers

    # Connect to the default web camera
    source = cv2.VideoCapture(0)

    # capture frames from web camera every 30 ms
    while True:
        has_frame, frame = source.read()
        if not has_frame:
            break
        # Detect hands on current video frame
        hands = detector.findHands(frame, draw=False)
        # If only one hand detected
        if len(hands) == 1:
            hand = hands[0]
            # Calculate number of fingers on the hand
            fingers = sum(detector.fingersUp(hand))
        else:
            # Otherwise no fingers
            fingers = None

        time.sleep(0.03)


main()

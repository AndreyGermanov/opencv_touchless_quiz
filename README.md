# opencv_webcam_filtering_webapp
This is a Web application, that uses OpenCV and MediaPipe to implement a quiz, that you can pass without keyboard
and mouse. Just show answers to a web camera using fingers and artificial intelligence will do the rest.

See demo video: https://youtu.be/5dc_58M9F2k

## Install

* Clone this repository: `git clone git@github.com:AndreyGermanov/opencv_touchless_quiz`
* Go to the root of cloned repository
* Install dependencies by running `pip3 install -r requirements.txt`

## Run

Ensure that a web camera connected and not busy by other applications.

Execute:

```
python3 app.py
```

It will start a webserver on http://localhost:8080. Use any web browser to open the web interface.

Using the interface you can pass a quiz without keyboard or mouse, just by showing fingers to a web camera as answers.
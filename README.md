# Interactive Whiteboard with Vector Conversion

This is a web-based whiteboard application that allows you to draw and convert your drawings into vector images. The vectorized images can be used for creating quizzes or other educational content.

## Features

- Interactive drawing canvas
- Convert drawings to vector images
- Download vectorized images
- Clean and modern user interface

## Setup

1. Make sure you have Python 3.7+ installed on your system
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the Flask application:
   ```
   python app.py
   ```
4. Open your web browser and navigate to `http://localhost:5000`

## Usage

1. Draw on the whiteboard using your mouse
2. Click "Convert to Vector" to transform your drawing into a vector image
3. The vectorized version will appear below the whiteboard
4. Click "Download Vector" to save the vectorized image
5. Use "Clear" to start over

## Technical Details

The application uses:
- Flask for the backend
- HTML5 Canvas for drawing
- OpenCV for image processing and vector conversion
- JavaScript for frontend interactivity

## Requirements

- Python 3.7+
- Flask
- OpenCV
- Pillow
- NumPy
- scikit-image 
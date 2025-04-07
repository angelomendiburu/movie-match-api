from flask import Flask, send_file, request
import os

app = Flask(__name__)

# Directory where the CSV files are stored
CSV_DIR = "c:\\Users\\OBSER\\dev\\movie-match-api\\data"

@app.route('/movies')
def get_movies_by_genre():
    genre = request.args.get('genre')
    if not genre:
        return "Genre not specified", 400

    # Construct the file path for the requested genre
    file_path = os.path.join(CSV_DIR, f"{genre}.csv")
    if not os.path.exists(file_path):
        return f"No data available for genre: {genre}", 404

    # Serve the CSV file
    return send_file(file_path, as_attachment=False, mimetype='text/csv')

if __name__ == '__main__':
    app.run(debug=True, port=3000)

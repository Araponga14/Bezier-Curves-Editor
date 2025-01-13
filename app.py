from flask import Flask, render_template, request, jsonify
import numpy as np

app = Flask(__name__)

def de_casteljau(points, t):
    """ Calcula um ponto na curva de Bézier usando o algoritmo de De Casteljau """
    if len(points) == 1:
        return points[0]
    new_points = [( (1 - t) * x1 + t * x2, (1 - t) * y1 + t * y2 ) 
                  for (x1, y1), (x2, y2) in zip(points[:-1], points[1:])]
    return de_casteljau(new_points, t)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compute_bezier', methods=['POST'])
def compute_bezier():
    data = request.json
    control_points = data.get('points', [])
    num_segments = int(data.get('segments', 50))
    
    if len(control_points) < 2:
        return jsonify({"error": "É necessário pelo menos 2 pontos."}), 400
    
    t_values = np.linspace(0, 1, num_segments)
    bezier_curve = [de_casteljau(control_points, t) for t in t_values]
    
    return jsonify(bezier_curve)

if __name__ == '__main__':
    app.run(debug=True)

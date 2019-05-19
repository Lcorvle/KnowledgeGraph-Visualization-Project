from flask import Flask,render_template,g,session, jsonify
from flask_cors import CORS
#from flask_sqlalchemy import SQLAlchemy
#db = SQLAlchemy()
from flask import request
from .main import GetGraphStructure


app = Flask(__name__, template_folder="templates",static_folder="static",static_url_path="/backend/static")


def create_app():
    #防止跨域攻击
    #CORS(app)
    #注册蓝图
    from . import main
    app.register_blueprint(main.main)
    #db.init_app(app)
    return app


@app.route('/api/process', methods=['GET', 'POST'])
def process_data():
    rules = {
        "one_node_to_one_node": [{"A": "COUNTRIES", "B": "CAPITALS"}],
        "one_node_to_one_attr": [{"A": "COUNTRIES", "B": "population"}],
        "one_node_to_one_or_more_node": [{"A":"COUNTRIES", "B":"CONTINENTS"}],
        "one_node_to_one_or_more_attr": [{"A": "COUNTRIES", "B": "code"}]}
    from . import main
    results = main.ruleFilter(rules)
    return jsonify({
        'status': 'success',
        'y': 1
    })


@app.route('/api/get_k_hop_neighbours', methods=['GET', 'POST'])
def get_k_hop_neighbours():
    import json
    from . import main
    nids = json.loads(request.form['nids'])
    types = json.loads(request.form['types'])
    overview_items = main.getKHopNeighbours(nids["overview"], types["overview"], 1)
    detail_items = main.getKHopNeighbours(nids["detail"], types["detail"], 1)
    return jsonify({
        'status': 'success',
        'overview_items': overview_items,
        'detail_items': detail_items
    })


@app.route('/api/get_id_by_rules', methods=['GET', 'POST'])
def get_id_by_rules():
    pass
    # import json
    # from . import main
    # nids = json.loads(request.form['nids'])
    # types = json.loads(request.form['types'])
    # overview_items = main.getKHopNeighbours(nids["overview"], types["overview"], 1)
    # detail_items = main.getKHopNeighbours(nids["detail"], types["detail"], 1)
    # return jsonify({
    #     'status': 'success',
    #     'overview_items': overview_items,
    #     'detail_items': detail_items
    # })

from flask import render_template, jsonify
from flask import Blueprint
from flask import url_for
from py2neo import Graph, Node, Relationship, Subgraph
import csv
import json

main = Blueprint('main', __name__, template_folder='templates', static_folder='static', static_url_path="/static")
graph = Graph()

loadstr = ""
counter = 0

def buildKnowledgeGraph(filename):
  loadstr = ""

  if filename == None:
    return False
  entities = {}
  links = []
  typedict = ['countries', 'capitals', 'currencies', 'continents']

  with open(filename, encoding='UTF-8') as csvfile:
    csv_reader = csv.reader(csvfile)
    header = next(csv_reader)
    index = 0
    idlist = 0

    typeEntites = {}
    typeRelations = {}

    for row in csv_reader:
      en1 = row[0].split('/')[-1][:-1]
      typeindex = -2
      splitrow = row[0].split('/')
      while splitrow[typeindex] not in typedict:
        typeindex -= 1
      type = splitrow[typeindex]
      en1 = type + en1
      if en1 not in entities:
        entities[en1] = {'fulltext': row[0], 'nid': idlist}
        idlist += 1
      if 'type' not in entities[en1]:
        entities[en1]['type'] = type
      relation = ""
      relationType = 0
      if row[1][0] == '<':
        relation = row[1].split('/')[-1][:-1]
        if '#' in relation:
          relation = relation.split('#')[-1]
      else:
        relation = row[1]

      en2 = ""
      if row[2][0] == '<':
        en2 = row[2][1:-1]
        if relation == "rdf:type":
          en2 = en2.split("/")[-1]
          if '#' in en2:
            en2 = en2.split('#')[-1]
        elif relation == "owl:sameAs":
          if en2[-1] == '/':
            en2 = en2[:-1]
          en2 = en2.split("/")[-1]
        elif en2.split("/")[-2] not in ["countries", "currencies", "continents"] and en2.split("/")[-3] not in ["capitals"]:
          if en2[-1] == '/':
            en2 = en2[:-1]
          en2 = en2.split("/")[-1]
          if '#' in en2:
            en2 = en2.split('#')[-1]
        else:
          en2 = en2.split("/")[-1]
          splitrow = row[2].split('/')
          typeindex = -2
          while splitrow[typeindex] not in typedict:
            typeindex -= 1
          type2 = splitrow[typeindex]
          links.append((en1, relation, type2 + en2, row[1]))

          # 未在第一列出现的实体将在处理时被删除
          continue
      else:
        en2 = row[2]
      if en1 in entities:
        if relation in entities[en1]:
          entities[en1][relation].append(en2)
        else:
          entities[en1][relation] = [en2]
      else:
        entities[en1] = {}
        entities[en1][relation] = [en2]

    entityNode = {}
    nodes = []
    relationships = []
    for e in entities:
      entity = entities[e]
      #if entity['name'] == "AF#AF":
      #  print(entity)
      #print(entity)
      #print(entityNode["rdf:type"])
      #if "rdf:type" in entity:
      #  print(True)
      uppertype = entity["type"].upper()
      node = Node(uppertype, fulltext=entity['fulltext'])
      if uppertype in typeEntites:
        if uppertype == 'COUNTRIES':
            typeEntites[uppertype].append(json.dumps({"nid": entity['nid'], "name": entity['name'][0], "population": entity['population'][0]}))
        else:
            typeEntites[uppertype].append(json.dumps({"nid": entity['nid'], "name": entity['name'][0]}))
      else:
        if uppertype == 'COUNTRIES':
            typeEntites[uppertype] = [json.dumps({"nid": entity['nid'], "name": entity['name'][0], "population": entity['population'][0]})]
        else:
            typeEntites[uppertype] = [json.dumps({"nid": entity['nid'], "name": entity['name'][0]})]
      #print(entity['rdf:type'][0].upper())
      #if entity['type'].upper() == 'CONTINENTS':
      #  print(entity)
      #print(entity["rdf:type"][0].upper())
      for attr in entity:
        if attr == 'fulltext' or attr == 'type':
          continue
        node[attr] = entity[attr]
      entityNode[e] = node
      nodes.append(node)
      #graph.create(node)

    for l in links:
      if l[2] in entityNode:
        upperr = l[1].upper()
        link = Relationship(entityNode[l[0]], upperr, entityNode[l[2]])
        link['fulltext'] = l[3]
        link['relation'] = l[1].upper()
        relationships.append(link)
        if upperr in typeRelations:
          typeRelations[upperr].append(json.dumps({"start": entityNode[l[0]]['nid'], "end": entityNode[l[2]]['nid']}))
        else:
          typeRelations[upperr] = [json.dumps({"start": entityNode[l[0]]['nid'], "end": entityNode[l[2]]['nid']})]
      #graph.create(link)
    loadstr += "{\"Labels\":{"
    for label in typeEntites:
      loadstr = loadstr + "\"" + label + "\"" + ": ["
      for k in typeEntites[label]:
        loadstr += k
        loadstr += ','
      loadstr = loadstr[:-1] + '],'
    loadstr = loadstr[:-1] + '},'

    loadstr += "\"Relationships\":{"
    for label in typeRelations:
      loadstr = loadstr + "\"" + label + "\"" + ": ["
      for k in typeRelations[label]:
        loadstr += k
        loadstr += ','
      loadstr = loadstr[:-1] + '],'
    loadstr = loadstr[:-1] + '}}'

    #print(loadstr)
    #print(json.loads(loadstr))
    #with open("ks.txt", 'w') as fwrite:
    #  fwrite.write(loadstr)

    totalgraph = Subgraph(nodes=nodes, relationships=relationships)
    graph.create(totalgraph)
    return loadstr

def clearGraph():
  graph.evaluate('MATCH (n) DETACH DELETE n')

def getKHopNeighbours(starts, startTypes, k):
  items = []
  for i in range(0, len(starts)):
    items.append(getNeighbours(starts[i], startTypes[i], k))
  return items


def getNeighbours(start, startType, k):
  #print("MATCH (p:" + startType + " {name:[\'" + start + "\']})-[r*1.." + str(k) + "]->(q) return p,r,q")
  ans = graph.run(
    "MATCH (p:" + startType + " {nid:" + str(start) + "})-[r*1.." + str(k) + "]->(q) return p,r,q")  # .to_subgraph()
  #print(ans)

  s1 = None
  for record in ans:
    s_ = None
    for value in record.values():
      #print(value)
      if isinstance(value, Subgraph):
        #print("yes")
        if s_ is None:
          s_ = value
        else:
          s_ |= value
      else:
        for v in value:
          if isinstance(v, Subgraph):
            if s_ is None:
              s_ = v
            else:
              s_ |= v#Subgraph(set(s_.nodes), set(s_.relationships) | value[0])
    #print("s_: ", s_)
    if s_ is not None:
      if s1 is None:
        s1 = s_
      else:
        s1 |= s_
  ans = s1
  item = {}
  nodes = []
  edges = []

  for n in ans.nodes:
    dict = {}
    for attr in n:
      dict[attr] = n[attr]
    nodes.append(dict)
  item["nodes"] = nodes

  for r in ans.relationships:
    dict = {}
    dict['start'] = r.nodes[0]["nid"]
    dict['end'] = r.nodes[1]["nid"]
    for attr in r:
      dict[attr] = r[attr]
    edges.append(dict)
  item["edges"] = edges
  item["start_nid"] = start
  return item

@main.route('/api/GetGraphStructure', methods=['GET', 'POST'])
def GetGraphStructure():
    #print(loadstr)
    #return loadstr
    return loadstr

def dataUpdate(nid, attr, val):
  graph.evaluate("MATCH (n {nid: " + str(nid) + "}) SET n." + attr + "=" + str(val) + " RETURN n")

def ruleFilter(rules):
  #rules = {"one_node_to_one_node": [{"A": "COUNTRIES", "B": "CAPITALS"}],"one_node_to_one_attr": [{"A": "COUNTRIES", "B": "population"}], "one_node_to_one_or_more_node": [{"A":"COUNTRIES", "B":"CONTINENTS"}], "one_node_to_one_or_more_attr": [{"A": "COUNTRIES", "B": "code"}]}
  output = {}
  if "one_node_to_one_node" in rules:
    output["one_node_to_node"] = []
    rulelist = rules["one_node_to_one_node"]
    for r in rulelist:
      rA = r["A"]
      rB = r["B"]
      #print("MATCH (p:" + rA + ") where not (p)-->(:" + rB + ") return p")
      ans = graph.run("MATCH (p:" + rA + ") where not (p)-->(:" + rB + ") return p").to_subgraph()
      ns = []
      if not ans is None:
        for n in ans.nodes:
          ns.append(n['nid'])
      #print("MATCH (p:" + rA + ")-->(q:" + rB + ") with p, count(*) as foaf where foaf > 1 return p")
      ans = graph.run(
        "MATCH (p:" + rA + ")-->(q:" + rB + ") with p, count(*) as foaf where foaf > 1 return p").to_subgraph()
      if not ans is None:
        for n in ans.nodes:
          ns.append(n['nid'])
      output["one_node_to_node"].append(ns)

  if "one_node_to_one_attr" in rules:
    output["one_node_to_one_attr"] = []
    rulelist = rules["one_node_to_one_attr"]
    for r in rulelist:
      rA = r["A"]
      rB = r["B"]
      #print("MATCH (p:" + rA + ") return p")
      ans = graph.run("MATCH (p:" + rA + ") return p").to_subgraph()
      ns = []
      if not ans is None:
        for n in ans.nodes:
          if rB not in n:
            ns.append(n['nid'])
          else:
            if isinstance(n[rB], list):
              if len(n[rB]) == 0 or len(n[rB]) >= 2:
                ns.append(n['nid'])
      output["one_node_to_one_attr"].append(ns)
  if "one_node_to_one_or_more_node" in rules:
    output["one_node_to_one_or_more_node"] = []
    rulelist = rules["one_node_to_one_or_more_node"]
    for r in rulelist:
      rA = r["A"]
      rB = r["B"]
      #print("MATCH (p:" + rA + ") where not (p)-->(:" + rB + ") return p")
      ans = graph.run("MATCH (p:" + rA + ") where not (p)-->(:" + rB + ") return p").to_subgraph()
      ns = []
      if not ans is None:
        for n in ans.nodes:
          ns.append(n['nid'])
      output["one_node_to_one_or_more_node"].append(ns)
  if "one_node_to_one_or_more_attr" in rules:
    output["one_node_to_one_or_more_attr"] = []
    rulelist = rules["one_node_to_one_or_more_attr"]
    for r in rulelist:
      rA = r["A"]
      rB = r["B"]
      #print("MATCH (p:" + rA + ") return p")
      ans = graph.run("MATCH (p:" + rA + ") return p").to_subgraph()
      ns = []
      if not ans is None:
        for n in ans.nodes:
          if rB not in n:
            ns.append(n['nid'])
      output["one_node_to_one_or_more_attr"].append(ns)
  return json.dumps(output)

def get_edges():
  return graph.evaluate('MATCH (n) return n')

def getTypeNodeNum(nodeType):
  return graph.evaluate("MATCH (p:" + nodeType.upper() + ") return count(*)")

def getTypeEdgeNum(startType, endType):
  return graph.evaluate("MATCH (p1:" + startType.upper() + ")-->(p2:" + endType.upper() + ") return count(*)")

@main.route('/', defaults={'path': ''})
@main.route('/<path:path>')
def index(path):
  #global counter
  #counter += 1
  #print("----------------===========--------")
  #print(counter)
  global loadstr
  clearGraph()
  loadstr = buildKnowledgeGraph("./backend/main/kg.csv")
  #GetGraphStructure()
  #getKHopNeighbours([351], ['COUNTRIES'], 3)
   #get_edges()
  return render_template('index.html')
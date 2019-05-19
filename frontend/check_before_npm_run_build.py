import os

if __name__ == '__main__':
    if not os.path.exists("../backend/templates/index.html"):
        if not os.path.exists("../backend/templates"):
            os.makedirs("../backend/templates")
        open("../backend/templates/index.html", 'w')
    if not os.path.exists("../backend/static/build"):
        os.makedirs("../backend/static/build")

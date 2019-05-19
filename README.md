# Knowledge graph

### Environment
+ Python 3.5.2
+ npm 5.5.1

### Setup
+ Under the root directory
  ```
  pip3 install -r requirements.txt
  ```
+ Under the directory `frontend/`
  ```
  npm install
  ```
  
### Run
+ Please create an optimized build of the frontend app by running `npm_run_build.bat` in the directory `frontend/`

+ Then you can use flask runserver by running `python manage.py` in the root directory

+ **Note**: Hot reloading is unavailable, which means that you need to run `npm run build` to check the changes whenever modifying the files in `frontend/`


启动数据库Neo4j的方式：
1、进入路径\neo4j-community-3.5.0\bin
2、执行命令neo4j.bat console
#///////////////////////////////////////////
#/ Dan Nielsen
#///////////////////////////////////////////
import os
import sys
import subprocess
import requests
import logging
from flask import Flask, send_from_directory
from google.cloud import storage

app = Flask(__name__)
ext_out = 'otf' #No dot
bucket_name = 'continua-bucket'
bucket_http_path = 'https://storage.googleapis.com/' + bucket_name + '/'

def upload_to_bucket(bucket_name, filename):
  storage_client = storage.Client()
  bucket = storage_client.get_bucket(bucket_name)
  blob = bucket.blob(filename)
  blob.upload_from_filename(filename)

def del_file(filename):
  if os.path.isfile(filename):
    os.remove(filename)
  else:
    print("Error: %s file not found" % filename)

@app.route('/clean')
def clean():
  dir_name = "."
  test = os.listdir(dir_name)
  for item in test:
    if item.endswith(".svg") or item.endswith(".otf"):
      del_file(os.path.join(dir_name, item))

@app.route('/<filename_in>')
def fontforge(filename_in):
  filename_out = os.path.splitext(filename_in)[0] + '.' + ext_out
  rsp = requests.get(bucket_http_path+filename_in)
  with open(filename_in, 'wb') as f:
    print('Saving input file to container')
    f.write(rsp.content)
  cmd = "\"Open('%s'); Generate('%s')\"" % (filename_in, filename_out)
  out = subprocess.check_output('fontforge -lang=ff -c ' + cmd, shell=True)
  upload_to_bucket(bucket_name, filename_out)
  return send_from_directory('.', filename_out)

if __name__ == "__main__":
  file_handler = logging.FileHandler('output.log')
  handler = logging.StreamHandler()
  file_handler.setLevel(logging.DEBUG)
  handler.setLevel(logging.DEBUG)
  file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
  ))
  handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
  ))
  app.logger.addHandler(handler)
  app.logger.addHandler(file_handler)
  app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))

import re
import json

ts_file_path = 'frontend/src/data/algorithmsData.ts'
json_out_path = 'frontend/public/data/algorithms/algorithms_visualizer.json'

with open(ts_file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We can import ts in node or parse with python ast / js object eval
# Let's use node to evaluate algorithmsData.ts via tsx / esbuild or node script

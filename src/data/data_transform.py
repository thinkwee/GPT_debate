from pprint import pprint
import json
import argparse
import sys
import shutil

parser = argparse.ArgumentParser(description="Format plain text to json and add it to data.")
parser.add_argument("-a", "--add", help="add to data", action="store_true")
args = parser.parse_args()
add_to_exist = args.add

exist = json.loads(open("./debate.json", "r", encoding="utf-8").read())

new_debate = []
with open("new_debate", "r") as f:
    for line in f:
        new_debate.append(line.strip())

new_json = dict()
new_json['title'] = new_debate[0]
new_json['remark'] = new_debate[1]
new_json['description'] = new_debate[2:4] + ['点击展示更多']
new_json['desc_cn'] =  new_debate[2:]
new_json['title_en'] = new_json['title']
new_json['desc_en'] = new_json['description']
new_json['remark_en'] = new_json['remark']
new_json['preview'] = ''
new_json['website'] = ''
new_json['source'] = ''
new_json['tags'] = ''
new_json['id'] = len(exist) + 1
new_json['weight'] = 1
pprint(new_json)

if add_to_exist:
    exist.append(new_json)
    shutil.copy("./debate.json", "debate.json.bak")
    with open("debate.json", "w", encoding="utf-8") as f:
        json.dump(exist, f, ensure_ascii=False)
    print("added to data")
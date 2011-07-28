#!/usr/bin/python

import subprocess
import sys
import json
import re

commit_re = re.compile(r'([\da-f]{7}) (.*)')
stat_re = re.compile(r' \d+ files changed, (\d+) insertions..., (\d+) deletions...')

command = ['git', 'log', '-M', '--reverse', '--oneline', '--shortstat'] + sys.argv[1:]
proc = subprocess.Popen(command, stdout=subprocess.PIPE)
data = []
for line in proc.stdout:
    match = commit_re.match(line)
    if match:
        commit, msg = match.groups()
        continue

    match = stat_re.match(line)
    if match:
        adds, dels = map(int, match.groups())
        data.append((commit, msg, adds, dels))

print 'var kData = ',
json.dump(data, sys.stdout)
print ';'

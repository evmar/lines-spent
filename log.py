#!/usr/bin/python

import subprocess
import sys
import json
import re

git_args = sys.argv[1:]

commit_re = re.compile(r'(\d+) \S+ (.*)')
stat_re = re.compile(r' \d+ files changed, (\d+) insertions..., (\d+) deletions...')

command = ['git', 'log', '-M', '--reverse', '--shortstat',
           '--date=raw', '--format=%ad %s']
command += git_args
proc = subprocess.Popen(command, stdout=subprocess.PIPE)
data = []
for line in proc.stdout:
    match = commit_re.match(line)
    if match:
        timestamp, msg = match.groups()
        continue

    match = stat_re.match(line)
    if match:
        adds, dels = map(int, match.groups())
        data.append({'time':timestamp, 'msg':msg, 'add':adds, 'del':dels})
        sys.stderr.write('.')
        sys.stderr.flush()
print >>sys.stderr

print 'var kData = ',
json.dump({
        'git_args': git_args,
        'changes': data,
}, sys.stdout)
print ';'

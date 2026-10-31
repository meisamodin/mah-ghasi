import re
s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf-8').read()
names="qzm qzd qzr mds mdc skn skd sks gla glt gld glc nta ntd dtm dtg znm znp zng znd znn frk fra frd kcd kca kcx kcg".split()
for n in names:
    c=len(re.findall(r"a==='"+n+"'",s))
    if c:print('COLLIDE',n,c)
ids=['qz','mid','sk','gl','dtc','zen','frs','kcl']
for i in ids:
    if re.search(r"\['"+i+r"','",s) or ("s==='"+i+"'") in s:print('ID collide',i)
print('checked')

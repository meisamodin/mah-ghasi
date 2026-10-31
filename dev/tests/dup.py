import re,collections
s=open('/mnt/user-data/outputs/mahbanoo.html',encoding='utf-8').read()
c=collections.Counter(re.findall(r"a==='([a-z0-9]+)'\)?\{",s))
d=[k for k,v in c.items() if v>1 and k.startswith('y')]
print(d)
for k in d:
    print(k,[s[m.start():m.start()+80].replace('\n',' ') for m in re.finditer(r"a==='"+k+r"'\)?\{",s)])

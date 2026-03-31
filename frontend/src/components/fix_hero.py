import re

path = r'd:\cidcell-main\cidcell-main\frontend\src\components\HeroSection.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Active Nodes
content = content.replace('Active Nodes', 'Project Scope')
content = content.replace('1,248<span className="text-blue-400 text-sm ml-1">+</span>', '134<span className="text-blue-400 text-sm ml-1">Files</span>')
content = content.replace('Capacity: <span className="text-white">75%</span>', 'Status: <span className="text-white">Active</span>')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

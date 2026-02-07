import bs4
import re
import json

# 读取文件
with open('public/original-demo-full.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = bs4.BeautifulSoup(html_content, 'html.parser')

final_nodes = []

# 定义所有树的ID
tree_ids = ['num', 'cat', 'catnum', 'geo', 'time', 'relationnal']

for tree_id in tree_ids:
    tree_div = soup.find('div', id=tree_id)
    if not tree_div:
        print(f"Warning: Tree {tree_id} not found")
        continue
        
    print(f"Processing tree: {tree_id}")
    
    # 在当前树内寻找节点
    links = tree_div.find_all('a', href=re.compile(r'^#'))
    
    # 在当前树内寻找文本 (缩小搜索范围，提高匹配准确率)
    texts = tree_div.find_all('text')
    text_nodes = []
    for t in texts:
        transform = t.get('transform', '')
        match = re.search(r'matrix\([^,]*?([\d\.-]+)\s+([\d\.-]+)\)', transform)
        if match:
            tx = float(match.group(1))
            ty = float(match.group(2))
            content = " ".join([ts.get_text().strip() for ts in t.find_all('tspan')])
            if not content:
                content = t.get_text().strip()
            text_nodes.append({'text': content, 'x': tx, 'y': ty})
            
    # 匹配
    for link in links:
        href = link.get('href').replace('#', '')
        img = link.find('image')
        
        if img:
            transform = img.get('transform', '')
            match = re.search(r'matrix\([^,]*?([\d\.-]+)\s+([\d\.-]+)\)', transform)
            
            x, y = 0, 0
            if match:
                x = float(match.group(1))
                y = float(match.group(2))
            
            # 寻找最近的 text
            best_dist = 999999
            best_text = href # 默认用 ID
            
            for t in text_nodes:
                dist = ((t['x'] - x)**2 + (t['y'] - y)**2) ** 0.5
                if dist < 150 and dist < best_dist: # 缩小阈值到 150
                    best_dist = dist
                    best_text = t['text']
            
            final_nodes.append({
                "id": href,
                "label": best_text, # 这里的 label 已经是汉化过的了
                "group": tree_id,
                "x": x,
                "y": y,
                # 偏移中心点以便后续连线
                "cx": x + 48,
                "cy": y + 48
            })

# 输出 JSON
output_json = json.dumps(final_nodes, ensure_ascii=False, indent=2)

with open('src/data/extracted_nodes_v2.json', 'w', encoding='utf-8') as f:
    f.write(output_json)
    
print(f"Extracted {len(final_nodes)} nodes with group info.")

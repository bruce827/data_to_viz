import bs4
import re
import json

# 读取文件
with open('public/original-demo-full.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

soup = bs4.BeautifulSoup(html_content, 'html.parser')

nodes = []

# 1. 提取所有叶子节点 (包含在 <a data-toggle="modal"> 中)
# 原版结构: <a href="#heatmap"><image transform="..."></a>
links = soup.find_all('a', href=re.compile(r'^#'))

print(f"Found {len(links)} potential leaf nodes.")

for link in links:
    href = link.get('href').replace('#', '')
    img = link.find('image')
    
    if img:
        # 提取 transform 属性中的坐标
        # 格式通常为: matrix(0.8522 0 0 0.8522 1357.1085 1169.2806)
        # 最后两个数字是 x, y (或者 e, f)
        transform = img.get('transform', '')
        match = re.search(r'matrix\([^,]*?([\d\.-]+)\s+([\d\.-]+)\)', transform)
        
        x, y = 0, 0
        if match:
            x = float(match.group(1))
            y = float(match.group(2))
        
        # 尝试寻找对应的 label
        # 这是一个难点，因为 text 标签在外面。
        # 策略：在整个 svg 中寻找距离该图片 (x,y) 最近的 text 标签。
        
        nodes.append({
            "id": href,
            "type": "leaf",
            "x": x,
            "y": y,
            "raw_transform": transform
        })

# 2. 尝试寻找 Text 标签来匹配 Label
# 这是一个简单的空间搜索算法
texts = soup.find_all('text')
text_nodes = []

for t in texts:
    # 提取 text 的坐标
    # 格式: matrix(1 0 0 1 1356.6582 871.4056)
    transform = t.get('transform', '')
    match = re.search(r'matrix\([^,]*?([\d\.-]+)\s+([\d\.-]+)\)', transform)
    
    if match:
        tx = float(match.group(1))
        ty = float(match.group(2))
        
        # 获取文本内容 (可能是多行 tspan)
        content = " ".join([ts.get_text().strip() for ts in t.find_all('tspan')])
        if not content:
            content = t.get_text().strip()
            
        text_nodes.append({'text': content, 'x': tx, 'y': ty})

# 3. 将 Text 匹配给 Nodes
# 规则：Text 的 y 坐标通常在 Image y 坐标的下方或上方附近
# 图片高度约 114 (缩放后约 100)
# 我们假设 label 在图片中心附近

for node in nodes:
    img_x = node['x']
    img_y = node['y']
    
    # 寻找最近的 text
    best_dist = 999999
    best_text = ""
    
    for t in text_nodes:
        # 距离计算 (欧氏距离)
        dist = ((t['x'] - img_x)**2 + (t['y'] - img_y)**2) ** 0.5
        
        # 阈值：如果在 200 像素内，认为可能是
        if dist < 200 and dist < best_dist:
            best_dist = dist
            best_text = t['text']
            
    node['label'] = best_text
    
    # 修正坐标：原版 SVG 的 matrix 里的 x,y 可能是左上角
    # 我们希望得到中心点。图片原始尺寸 114x114，缩放 0.8522 -> ~97x97
    # 所以中心点大约是 x + 48, y + 48
    node['cx'] = node['x'] + 48
    node['cy'] = node['y'] + 48


# 输出 JSON
output_json = json.dumps(nodes, ensure_ascii=False, indent=2)
print(output_json)

# 保存到文件
with open('src/data/extracted_nodes.json', 'w', encoding='utf-8') as f:
    f.write(output_json)


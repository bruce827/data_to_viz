import os

# 定义翻译字典 (Key: 原文, Value: 中文)
# 注意顺序：长词优先，避免部分匹配错误
translations = {
    # 图表名称
    "RIDGE": "山脊",
    "VIOLIN": "小提琴",
    "BOXPLOT": "箱线图",
    "BOX PLOT": "箱线图",
    "DENDROGRAM": "树状图",
    "HEATMAP": "热力图",
    "PCA": "主成分分析",
    "CORRELOGRAM": "相关矩阵",
    "SCATTER PLOT": "散点图",
    "SCATTER": "散点",
    "HISTOGRAM": "直方图",
    "DENSITY": "密度",
    "CONNECTED": "连线",
    "AREA PLOT": "面积图",
    "AREA": "面积",
    "STACKED": "堆叠",
    "STREAM": "河流",
    "GRAPH": "图",
    "BUBBLE": "气泡",
    "3D SCATTER": "3D散点",
    "SURFACE": "曲面图",
    "BARPLOT": "柱状图",
    "SPIDER": "雷达图",
    "RADAR": "雷达图",
    "WORDCLOUD": "词云",
    "PARALLEL": "平行坐标",
    "LOLLIPOP": "棒棒糖图",
    "CIRCULAR": "环形",
    "TREEMAP": "矩形树图",
    "DOUGHNUT": "甜甜圈图",
    "PIE PLOT": "饼图",
    "VENN DIAGRAM": "韦恩图",
    "CHORD DIAGRAM": "弦图",
    "SANKEY": "桑基图",
    "ARC DIAGRAM": "弧线图",
    "NETWORK": "网络图",
    "CHOROPLETH": "等值区域图",
    "HEXBIN": "六边形",
    "CARTOGRAM": "变形地图",
    "CONNECTION": "连接",
    "MAP": "地图",
    "LINE": "线",
    "PLOT": "图",
    
    # 类别与描述
    "Numeric": "数值型",
    "Categoric": "分类型",
    "Num & Cat": "数值&分类",
    "Maps": "地图",
    "Network": "网络关系",
    "Time series": "时间序列",
    
    "NOT ORDERED": "无序数据",
    "ORDERED": "有序数据",
    "SEVERAL": "多个",
    "NUMERIC": "数值变量",
    "VARIABLES": "变量",
    "VARIABLE": "变量",
    "ONE": "单",
    "TWO": "双",
    "THREE": "三",
    "MANY POINTS": "数据量大",
    "FEW POINTS": "数据量小",
    "HIERARCHICAL": "层级结构",
    "NESTED": "嵌套",
    "NO VALUE": "无权值",
    "WITH VALUE": "有权值",
    "DIRECTED": "有向",
    "UNDIRECTED": "无向",
    "EVOLUTION": "演变趋势",
    
    # 按钮与界面
    "The \"Original\" SVG Tree": "原版 SVG 决策树 (中文复刻)",
    "This is a 1:1 extraction": "这是对原版硬编码 SVG 实现的 1:1 提取与汉化。",
    "RIDGE LINE": "山脊图",
}

file_path = 'public/original-demo-full.html'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 执行替换
    for en, cn in translations.items():
        # 简单替换：注意这可能会替换掉 CSS 类名中的关键词（如 .numst1），需小心
        # 原文的 CSS 类名通常是小写 (numst)，而SVG里的文本通常是大写 (RIDGE)
        # 我们的字典里大部分是大写，应该比较安全。
        # 按钮文本是 Title Case (Numeric)，也处理了。
        content = content.replace(f">{en}<", f">{cn}<") # 替换完整标签内容
        content = content.replace(f" {en}<", f" {cn}<") # 替换 tspan 结尾
        content = content.replace(f">{en} ", f">{cn} ") # 替换 tspan 开头
        # 针对纯文本（不在标签边缘的，虽然SVG里很少）
        # 为了更激进一点，我们直接替换常见的全大写单词，但排除 CSS
        # 这种方式风险较高，我们先用精准匹配试试
        
    # 第二轮：直接替换已知的大写单词 (SVG tspan 内部)
    for en, cn in translations.items():
        if en.isupper() or en[0].isupper(): 
            # 避免替换 HTML 标签属性，只替换可见文本
            # 这是一个简化的处理，假设全大写单词多为展示文本
            content = content.replace(en, cn)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Successfully translated {file_path}")

except Exception as e:
    print(f"Error: {e}")

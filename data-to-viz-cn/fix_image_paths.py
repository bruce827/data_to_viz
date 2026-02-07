import re

file_path = 'public/original-demo-full.html'

# 定义修正映射 (错误路径 -> 正确路径)
# 我们利用正则来匹配 pattern: img/section/中文...png
replacements = {
    "img/section/主成分分析small.png": "img/section/PCAsmall.png",
    # 预防其他可能被误伤的
    "img/section/热力图Small.png": "img/section/HeatmapSmall.png", 
    "img/section/小提琴Small.png": "img/section/ViolinSmall.png",
    "img/section/箱线图1Small.png": "img/section/Box1Small.png",
    "img/section/树状图Small.png": "img/section/DendrogramSmall.png",
    "img/section/相关矩阵Small.png": "img/section/CorrelogramSmall.png",
    "img/section/山脊线图Small.png": "img/section/JoyplotSmall.png", # Joyplot corresponds to Ridgeline
    "img/section/山脊Small.png": "img/section/JoyplotSmall.png",
    # Density plot might be named Joyplot or Density
    "img/section/密度Small.png": "img/section/DensitySmall.png",
    "img/section/散点图Small.png": "img/section/ScatterPlotSmall.png",
    "img/section/散点Small.png": "img/section/ScatterPlotSmall.png",
    "img/section/面积图Small.png": "img/section/AreaSmall.png",
    "img/section/面积Small.png": "img/section/AreaSmall.png",
    "img/section/堆叠面积图Small.png": "img/section/StackedAreaSmall.png",
    "img/section/堆叠Small.png": "img/section/StackedAreaSmall.png",
    "img/section/河流图Small.png": "img/section/StreamSmall.png",
    "img/section/河流Small.png": "img/section/StreamSmall.png",
    "img/section/线图Small.png": "img/section/LineSmall.png",
    "img/section/线Small.png": "img/section/LineSmall.png",
    "img/section/气泡图Small.png": "img/section/BubblePlotSmall.png",
    "img/section/气泡Small.png": "img/section/BubblePlotSmall.png",
    "img/section/3D散点Small.png": "img/section/3dRoundSmall.png", # Guessing name
    "img/section/柱状图Small.png": "img/section/BarSmall.png",
    "img/section/雷达图Small.png": "img/section/SpiderSmall.png",
    "img/section/词云Small.png": "img/section/WordCloudSmall.png",
    "img/section/平行坐标Small.png": "img/section/Parallel1Small.png",
    "img/section/棒棒糖图Small.png": "img/section/LollipopSmall.png",
    "img/section/环形柱状图Small.png": "img/section/CircularBarplotSmall.png",
    "img/section/矩形树图Small.png": "img/section/TreeSmall.png",
    "img/section/甜甜圈图Small.png": "img/section/DoughnutSmall.png",
    "img/section/饼图Small.png": "img/section/PieSmall.png",
    "img/section/韦恩图Small.png": "img/section/VennSmall.png",
    "img/section/弦图Small.png": "img/section/ChordSmall.png",
    "img/section/桑基图Small.png": "img/section/SankeySmall.png",
    "img/section/弧线图Small.png": "img/section/ArcSmal.png", # Note spelling ArcSmal
    "img/section/网络图Small.png": "img/section/NetworkSmall.png",
    "img/section/等值区域图Small.png": "img/section/ChoroplethSmall.png",
    "img/section/六边形Small.png": "img/section/HexbinMapSmall.png",
    "img/section/变形地图Small.png": "img/section/CartogramSmall.png",
    "img/section/连接地图Small.png": "img/section/MapConnectionSmall.png",
    "img/section/地图Small.png": "img/section/MapSmall.png",
}

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 执行精准替换
    for wrong, correct in replacements.items():
        if wrong in content:
            print(f"Fixing: {wrong} -> {correct}")
            content = content.replace(wrong, correct)
    
    # 额外逻辑：如果刚才的翻译脚本把 "Small" 也可能误伤了（目前看还没），可以加逻辑。
    # 检查是否还有残留的中文图片路径
    # 正则匹配 src="img/section/.*?[一-龥].*?"
    matches = re.findall(r'xlink:href="(img/section/[^"\]*?[一-龥][^"\]*?)"', content)
    if matches:
        print("\nWARNING: Found remaining broken paths with Chinese characters:")
        for m in set(matches):
            print(m)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("\nImage paths fixed.")

except Exception as e:
    print(f"Error: {e}")

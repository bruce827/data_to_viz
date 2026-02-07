export type ChartPreviewConfig = {
  chartType: 'line' | 'bar' | 'scatter' | 'heatmap' | 'violin';
  mockDataGenerator: 'random_trend' | 'normal_dist' | 'categories' | 'matrix';
};

export type TreeNode = {
  id: string;
  label: string;
  description?: string;
  icon?: string; // Icon name from lucide-react or custom svg path
  children?: TreeNode[];
  
  // For interaction
  interactionMode?: 'select' | 'link'; 
  
  // For leaf nodes (charts)
  previewConfig?: ChartPreviewConfig;
};

export const decisionTreeData: TreeNode = {
  id: "root",
  label: "你的数据是什么类型？",
  description: "选择最符合你当前手头数据的类型",
  children: [
    {
      id: "numeric",
      label: "数值型 (Numeric)",
      description: "输入是纯数字，用于量化分析",
      children: [
        {
          id: "one_variable",
          label: "单个变量",
          description: "只关注这一列数据的分布",
          children: [
             {
              id: "histogram",
              label: "直方图",
              interactionMode: "link",
              previewConfig: { chartType: "bar", mockDataGenerator: "categories" }
            },
            {
              id: "density",
              label: "密度图",
              interactionMode: "link",
              previewConfig: { chartType: "line", mockDataGenerator: "normal_dist" }
            }
          ]
        },
        {
          id: "two_variables",
          label: "两个变量",
          description: "探究两个数值之间的关系",
          children: [
            {
              id: "scatter",
              label: "散点图",
              interactionMode: "link",
              previewConfig: { chartType: "scatter", mockDataGenerator: "normal_dist" }
            }
          ]
        },
         {
            id: "multi_variables",
            label: "多个变量",
            description: "寻找多维数据中的模式",
            children: [
              {
                id: "heatmap",
                label: "热力图",
                interactionMode: "link",
                previewConfig: { chartType: "heatmap", mockDataGenerator: "matrix" }
              }
            ]
          }
      ]
    },
    {
      id: "categorical",
      label: "分类型 (Categoric)",
      description: "包含文本标签或离散类别",
      children: []
    },
    {
      id: "map",
      label: "地图 (Maps)",
      description: "包含地理坐标信息",
      children: []
    }
  ]
};

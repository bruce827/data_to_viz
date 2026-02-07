
def extract_and_create_demo():
    with open('index.html', 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Define sections (adjusting for 0-based index)
    # Head section: until </head> + css agency
    head_end_idx = 0
    for i, line in enumerate(lines):
        if '</head>' in line:
            head_end_idx = i + 1
            break
    
    head_section = lines[:head_end_idx]

    # Button section
    # Find <div id="tree-button-container">
    btn_start_idx = 0
    for i, line in enumerate(lines):
        if 'id="tree-button-container"' in line:
            btn_start_idx = i
            break
    
    # Take a few lines after (it's short)
    btn_section = lines[btn_start_idx:btn_start_idx+12] 
    
    # Tree section
    # From <div id="num" class="tree"
    # To the end of relationnal tree
    tree_start_idx = 0
    for i, line in enumerate(lines):
        if 'id="num" class="tree"' in line:
            tree_start_idx = i
            break
            
    # Find end of trees. It's before "STORY SECTION"
    tree_end_idx = 0
    for i, line in enumerate(lines):
        if 'STORY SECTION' in line:
            tree_end_idx = i
            break
    
    tree_section = lines[tree_start_idx:tree_end_idx]

    # Script section
    script_start_idx = 0
    for i, line in enumerate(lines):
        if 'Bootstrap core JavaScript' in line:
            script_start_idx = i
            break
    
    script_section = lines[script_start_idx:]

    # Construct new file content
    new_content = []
    new_content.extend(head_section)
    new_content.append('<body id="page-top" style="background-color: white;">\n')
    new_content.append('<div class="container" style="margin-top: 50px;">\n')
    new_content.append('<div class="row"><div class="col-lg-12 text-center">\n')
    new_content.extend(btn_section)
    new_content.append('</div></div>\n')
    new_content.append('<br><br>\n')
    new_content.extend(tree_section)
    new_content.append('</div>\n') # Close container
    new_content.extend(script_section)

    with open('decision_tree_demo.html', 'w', encoding='utf-8') as f:
        f.writelines(new_content)

if __name__ == '__main__':
    extract_and_create_demo()

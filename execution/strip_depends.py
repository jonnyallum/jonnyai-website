import os, re

def strip_depends():
    root = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/infra/terraform/foundation'
    for f in os.listdir(root):
        if f.endswith('.tf'):
            path = os.path.join(root, f)
            with open(path, 'r') as file:
                content = file.read()
            
            # Remove depends_on blocks that are now invalid
            new_content = re.sub(r'depends_on\s*=\s*\[\s*(null,?\s*)*\]', '', content)
            
            with open(path, 'w') as file:
                file.write(new_content)

if __name__ == '__main__':
    strip_depends()

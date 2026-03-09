import os

def comment_out():
    path = 'c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/infra/terraform/foundation/autokey.tf'
    if not os.path.exists(path):
        return
        
    with open(path, 'r') as f:
        lines = f.readlines()
        
    with open(path, 'w') as f:
        f.write('/*\n')
        f.writelines(lines)
        f.write('\n*/\n')

if __name__ == '__main__':
    comment_out()

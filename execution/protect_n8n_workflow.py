import json
import uuid

workflow_file = "c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/workflow_IXnG6uZu3LSiPctj.json"

with open(workflow_file, 'r') as f:
    data = json.load(f)

# Extract nodes and connections from the nested 'data' object
nodes = data['data']['nodes']
connections = data['data']['connections']

# Create Filter Node
filter_node = {
    "parameters": {
        "conditions": {
            "options": {
                "caseSensitive": False,
                "leftValue": "",
                "typeValidation": "strict"
            },
            "conditions": [
                {
                    "id": str(uuid.uuid4()),
                    "leftValue": "={{ JSON.stringify($json.body) }}",
                    "operator": {
                        "type": "string",
                        "operation": "notContains",
                        "name": "filter_string_not_contains"
                    },
                    "rightValue": "marcus@jonnyai.co.uk"
                },
                {
                    "id": str(uuid.uuid4()),
                    "leftValue": "={{ JSON.stringify($json.body) }}",
                    "operator": {
                        "type": "string",
                        "operation": "notContains",
                        "name": "filter_string_not_contains"
                    },
                    "rightValue": "info@jonnyai.co.uk"
                }
            ],
            "combinator": "and"
        }
    },
    "id": str(uuid.uuid4()),
    "name": "Loop Protection",
    "type": "n8n-nodes-base.filter",
    "typeVersion": 1,
    "position": [
        384,
        352
    ]
}

# Add Filter Node to list
nodes.append(filter_node)

# Rewire connections
# Webhook (ID: e70cbbc7-282b-4309-b5b9-2140578889a6) -> Log to Chatroom (@Marcus) (ID: 86cde15e-f2e0-4391-b278-066045dcfcf3)
# New: Webhook -> Loop Protection -> Log to Chatroom

new_connections = {
    "Webhook": {
        "main": [
            [
                {
                    "node": filter_node["name"],
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    },
    filter_node["name"]: {
        "main": [
            [
                {
                    "node": "Log to Chatroom (@Marcus)",
                    "type": "main",
                    "index": 0
                }
            ]
        ]
    }
}

data['data']['nodes'] = nodes
data['data']['connections'] = new_connections

# Save the updated workflow
with open("c:/Users/jonny/Desktop/JonnyAI_JaiOS_4.0/.tmp/workflow_updated.json", "w") as f:
    json.dump(data['data'], f, indent=2)

print("Workflow updated and saved to .tmp/workflow_updated.json")

import os, json
from google.oauth2 import service_account
from googleapiclient import discovery

# Path to the service account
SA_PATH = r'C:\Users\jonny\Downloads\splendid-light-451420-a0-bfc0747dc627.json'

def list_instances():
    try:
        with open(SA_PATH) as f:
            sa_data = json.load(f)
        
        project_id = sa_data['project_id']
        credentials = service_account.Credentials.from_service_account_file(SA_PATH)
        compute = discovery.build('compute', 'v1', credentials=credentials)
        
        print(f"--- Checking Project: {project_id} ---")
        
        # List all instances across all zones
        request = compute.instances().aggregatedList(project=project_id)
        while request is not None:
            response = request.execute()
            for name, instances_scoped_list in response.get('items', {}).items():
                if 'instances' in instances_scoped_list:
                    for instance in instances_scoped_list['instances']:
                        print(f"Found Instance: {instance['name']}")
                        print(f"  Status: {instance['status']}")
                        print(f"  Zone: {instance['zone'].split('/')[-1]}")
                        for ni in instance.get('networkInterfaces', []):
                            for ac in ni.get('accessConfigs', []):
                                print(f"  External IP: {ac.get('natIP')}")
            
            request = compute.instances().aggregatedList_next(previous_request=request, previous_response=response)

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == '__main__':
    list_instances()

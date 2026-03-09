org_id          = "504480014851"
billing_account = "01B81F-F71DBB-299B25"

/*
The folder map is limited to three levels
The environment names are "Production", "Non Production" and "Development"
they are potentially referenced in iam.tf, service_projects.tf, and projects.tf
if you rename, e.g. "Production" to "Prod", you will need to find references like
module.cs-folders-level-1["Team 1/Production"].ids["Production"] and rename to
module.cs-folders-level-1["Team 1/Prod"].ids["Prod"]
*/
folders = {
  "Department 1" : {
    "Team 1" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 2" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 3" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 4" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
  },
  "Department 2" : {
    "Team 1" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 2" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 3" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 4" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
  },
  "Department 3" : {
    "Team 1" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 2" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 3" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
    "Team 4" : {
      "Production" : {},
      "Non-Production" : {},
      "Development" : {},
    },
  },
}
cmek_autokey_folders = [
  {
    "folder_path" : "Department 1/Team 1/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 1/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 1/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 2/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 2/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 2/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 3/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 3/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 3/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 4/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 4/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 1/Team 4/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 1/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 1/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 1/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 2/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 2/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 2/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 3/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 3/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 3/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 4/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 4/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 2/Team 4/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 1/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 1/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 1/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 2/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 2/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 2/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 3/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 3/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 3/Development",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 4/Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 4/Non-Production",
    "key_project_name" : "kms-key-project",
  },
  {
    "folder_path" : "Department 3/Team 4/Development",
    "key_project_name" : "kms-key-project",
  },
]
application_enabled_folder_paths = [
  "Department 1/Team 1/Production",
  "Department 1/Team 1/Non-Production",
  "Department 1/Team 1/Development",
  "Department 1/Team 2/Production",
  "Department 1/Team 2/Non-Production",
  "Department 1/Team 2/Development",
  "Department 1/Team 3/Production",
  "Department 1/Team 3/Non-Production",
  "Department 1/Team 3/Development",
  "Department 1/Team 4/Production",
  "Department 1/Team 4/Non-Production",
  "Department 1/Team 4/Development",
  "Department 2/Team 1/Production",
  "Department 2/Team 1/Non-Production",
  "Department 2/Team 1/Development",
  "Department 2/Team 2/Production",
  "Department 2/Team 2/Non-Production",
  "Department 2/Team 2/Development",
  "Department 2/Team 3/Production",
  "Department 2/Team 3/Non-Production",
  "Department 2/Team 3/Development",
  "Department 2/Team 4/Production",
  "Department 2/Team 4/Non-Production",
  "Department 2/Team 4/Development",
  "Department 3/Team 1/Production",
  "Department 3/Team 1/Non-Production",
  "Department 3/Team 1/Development",
  "Department 3/Team 2/Production",
  "Department 3/Team 2/Non-Production",
  "Department 3/Team 2/Development",
  "Department 3/Team 3/Production",
  "Department 3/Team 3/Non-Production",
  "Department 3/Team 3/Development",
  "Department 3/Team 4/Production",
  "Department 3/Team 4/Non-Production",
  "Department 3/Team 4/Development",
]

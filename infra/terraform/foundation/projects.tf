module "cs-project-vpc-host-prod" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 18.0"

  name       = "vpc-host-prod"
  project_id = "vpc-host-prod-ab293-rh686"
  org_id     = var.org_id
  folder_id  = local.folder_map["Common"].id

  billing_account                = var.billing_account
  enable_shared_vpc_host_project = true
  
}

module "cs-project-vpc-host-nonprod" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 18.0"

  name       = "vpc-host-nonprod"
  project_id = "vpc-host-nonprod-si538-ki061"
  org_id     = var.org_id
  folder_id  = local.folder_map["Common"].id

  billing_account                = var.billing_account
  enable_shared_vpc_host_project = true
  
}

module "cs-project-logging-monitoring" {
  source  = "terraform-google-modules/project-factory/google"
  version = "~> 18.0"

  name       = "central-logging-monitoring"
  project_id = "central-log-monitor-dl779-sp84"
  org_id     = var.org_id
  folder_id  = local.folder_map["Common"].id

  billing_account = var.billing_account
  
  activate_apis = [
    "compute.googleapis.com",
    "monitoring.googleapis.com",
  ]
}
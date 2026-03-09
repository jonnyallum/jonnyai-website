variable "billing_account" {
  description = "The ID of the billing account to associate projects with"
  type        = string
  default     = "01B81F-F71DBB-299B25"
}

variable "org_id" {
  description = "The organization id for the associated resources"
  type        = string
  default     = "504480014851"
}

variable "billing_project" {
  description = "The project id to use for billing"
  type        = string
  default     = "cs-host-cc7785f82da84dba8a14f6"
}

variable "folders" {
  description = "Folder structure as a map"
  type        = map
}

variable "application_enabled_folder_paths" {
  description = "The folder paths to enable resource manager capability"
  type        = list
}

variable "cmek_autokey_folders" {
  description = "Folders for CMEK autokey encryption"
  type        = list
}
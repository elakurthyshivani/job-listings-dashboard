from enum import Enum

class CosmosContainers(Enum):
    WORKDAY_JOB_LISTINGS = "workday-job-listings"
    GROUP_1_JOB_LISTINGS = "group-1-job-listings"
    OWN_SITE_JOB_LISTINGS = "own-site-job-listings"
    CONTAINER_NAMES = "container-names"

class JobStatus(Enum):
    NOT_APPLIED = 0
    NEW = 1
    APPLIED = 2
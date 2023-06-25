#!/bin/sh -eu

# ### Environment Variables
#
# - `STORYBOOK_S3_BUCKET_NAME`: Bucket name for storybook
# - `PR_NUMBER`: Pull request number
# - `GITHUB_STATUS_DESCRIPTION`: Description to show in GitHub status

# Extract repo_owner and repo_name from CIRCLE_REPOSITORY_URL(git@github.com:<repo_owner>/<repo_name>.git)
repo_owner=$(echo "$CIRCLE_REPOSITORY_URL" | awk -F '[:/.]' '{print $3}')
repo_name=$(echo "$CIRCLE_REPOSITORY_URL" | awk -F '[:/.]' '{print $4}')

target_url="https://${STORYBOOK_S3_BUCKET_NAME}.s3.ap-northeast-1.amazonaws.com/${PR_NUMBER}/index.html"

curl -X POST \
    "https://api.github.com/repos/${repo_owner}/${repo_name}/statuses/${CIRCLE_SHA1}" \
    -H 'Accept: application/vnd.github.v3+json' \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$(cat << EOS
    {
      "state": "success",
      "description": "${GITHUB_STATUS_DESCRIPTION:-Your tests passed on CircleCI!}",
      "target_url": "${target_url}",
      "context": "ci/circleci: storybook result"
    }
EOS
)"

#!/bin/sh -eu

regOutput='.reg/out.json'
regOutputCat=$(cat $regOutput)

failed_count="$(echo "$regOutputCat" | jq '.failedItems | length')"
new_count="$(echo "$regOutputCat" | jq '.newItems | length')"
passed_count="$(echo "$regOutputCat" | jq '.passedItems | length')"
deleted_count="$(echo "$regOutputCat" | jq '.deletedItems | length')"

# Text to display to gh status 
description="fail: $failed_count, new: $new_count, del: $deleted_count, pass: $passed_count"

curl -X POST \
    "https://api.github.com/repos/zenoplex/react-hooks/statuses/${CIRCLE_SHA1}" \
    -H 'Accept: application/vnd.github.v3+json' \
    -H "Authorization: Bearer $GITHUB_TOKEN" \
    -H 'Content-Type: application/json' \
    -d "$(cat << EOS
    {
      "state": "success",
      "description": "${description}",
      "target_url": "${REGSUIT_REPORT_URL}",
      "context": "ci/circleci: '"$CIRCLECI_JOB_NAME"'"
    }
EOS
)"

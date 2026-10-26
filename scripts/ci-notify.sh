#!/usr/bin/env bash
set -euo pipefail

# Jobs without access to the webhook secret skip silently.
[ -z "${GH_WEBHOOK:-}" ] && exit 0

REPO=nexus-dashboard
SERVICE=nexus-dashboard

COMMIT=$(git log -1 --format='%B' "$GH_SHA" 2>/dev/null \
  | awk 'NF {printf "%s%s",sep,$0; sep="<br>"} END {printf "\n"}' \
  || echo "N/A")

jq -n \
  --arg category "❌ Pipeline failed: ${GH_JOB_NAME}" \
  --arg repo "$REPO" \
  --arg service "$SERVICE" \
  --arg revision "$GH_SHA" \
  --arg actor "${GH_ACTOR:-N/A}" \
  --arg commit "$COMMIT" \
  --arg run_url "${GH_RUN_URL:-}" \
  '{
    cardsV2: [{
      card: {
        header: {title: $category, subtitle: $repo},
        sections: [
          {widgets: [
            {decoratedText: {topLabel: "Service", text: $service}},
            {decoratedText: {topLabel: "Revision", text: $revision}},
            {decoratedText: {topLabel: "Author", text: $actor}},
            {textParagraph: {text: ("Message<br>" + $commit), maxLines: 0}}
          ]},
          {widgets: [{buttonList: {buttons: [{
            text: "View run",
            onClick: {openLink: {url: $run_url}}
          }]}}]}
        ]
      }
    }]
  }' | curl -s -X POST "$GH_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d @-

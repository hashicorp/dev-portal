BRANCH_SLUG=$(echo \"$(git rev-parse --abbrev-ref HEAD)\" | tr '/' '-' | tr -cd '[:alnum:] -')
echo "https://dev-portal-git-$BRANCH_SLUG-hashicorp.vercel.app"

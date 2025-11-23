#!/bin/bash
# initialize git submodules during vercel build

# setup ssh for private submodule
if [ -n "$GIT_SSH_KEY" ]; then
  mkdir -p ~/.ssh
  echo "$GIT_SSH_KEY" > ~/.ssh/id_ed25519
  chmod 600 ~/.ssh/id_ed25519
  ssh-keyscan github.com >> ~/.ssh/known_hosts
fi

# initialize and update submodules
git submodule update --init --recursive --remote

echo "submodules initialized successfully"


eval "$(ssh-agent -s)" #start the ssh agent
chmod 600 .travis/id_rsa # this key should have push access
ssh-add .travis/id_rsa
IP=$1
if [ -z `ssh-keygen -F $IP` ]; then
  ssh-keyscan -H $IP >> ~/.ssh/known_hosts
fi

DEPLOY_DIR=$2
git config --global push.default matching
git remote add deploy app@$IP:$DEPLOY_DIR
echo "pushing to git $IP:$DEPLOY_DIR"
git push deploy master

ssh apps@$IP << EOF
  cd $DEPLOY_DIR
  npm install
  npm run build
EOF
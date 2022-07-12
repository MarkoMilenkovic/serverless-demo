Demo project with serverless framework and nodejs.
After installing and configuring serverless: 

serverless config credentials \
  --provider aws \
  --key ACCESS_KEY \
  --secret SECRET_KEY

To test locally use serverless-ofline plugin:
  run: npm run dev (=> this will invoke sls offline start --httpPort 3000)
Use endpoints with localhost:3000.
Note: requires re-runing previous command only if serverless.yml has been modified.

run in terminal following command to deploy changes to AWS:

selverless deploy

From output use HTTP endpoints.
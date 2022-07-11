Demo project with serverless framework and nodejs.
After installing and configuring serverless: 

serverless config credentials \
  --provider aws \
  --key ACCESS_KEY \
  --secret SECRET_KEY

run in terminal following command to deploy changes to AWS:

selverless deploy

From output use HTTP endpoints.
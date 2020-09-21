# continua

### conlang creation utility

## Initial

Create new project in Google Cloud web console - set project id as you wish

Install Google Cloud SDK

From commandline, run

```
gcloud auth login
gcloud config set project <project-id>
```
(Replace `<project-id>`)

If at any time you forget your project id, you can check with

`gcloud config get-value project`

## Credentials

To obtain `GOOGLE_APPLICATION_CREDENTIALS` for working locally, go to

[console.cloud.google.com/apis/credentials/serviceaccountkey](https://console.cloud.google.com/apis/credentials/serviceaccountkey)

Create new JSON service account key with role of project owner

Your `GOOGLE_APPLICATION_CREDENTIALS` file will appear in your downloads - move it to a more secure location, such as `~/.ssh`

To view these credentials in the future, go to

[console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts)

## Set up Storage

Create a new bucket - to do this from commandline

```
gsutil mb gs://<bucket-name>
```

If your bucket name has already been used, you must try a new name

Enable bucket permissions

```
gsutil cors set cors.json gs://<bucket-name>
```

## Set up Cloud Run

Now we cill create the background service that converts SVG font files into OTF files

Go to Cloud Run, and create a service

Do not change the default region - selecting a different region may invalidate your free-of-charge service, and then you may get a high bill

Service name `svg-to-otf`

Authentication `Allow unauthenticated invocations`

Configure the service's first revision `Deploy one revision...`

Container image URL `gcr.io/<project-id>/svg-to-otf`

You should see a message 'image not found' - that's okay, no image has yet been deployed

Go to the folder with the container

`cd fontforge-container`

Update and deploy by running

`gcloud builds submit --tag gcr.io/<project-id>/svg-to-otf && gcloud alpha run deploy --image gcr.io/<project-id>/svg-to-otf --platform managed`

If it asks you to enable, say yes - also, if it asks you to select a region, choose the same region as before

Logs viewable in console

[console.cloud.google.com/run](https://console.cloud.google.com/run)

## Open Port

Open Google Cloud firewall port for socket communication - this is used by the chat feature

```
gcloud compute firewall-rules create default-allow-websockets --allow tcp:65080 --target-tags websocket --description "Allow websocket traffic on port 65080"
```

If it asks you to enable, say yes

## Set Variables

Add these lines with correct information to `~/.bashrc`

```
export GOOGLE_APPLICATION_CREDENTIALS="<path-to-credential-file>"
export GOOGLE_CLOUD_PROJECT="<project-id>"
```

Set the following entries in `config.js`

```
CLOUD_BUCKET: '<bucket-name>',
SVG_TO_OTF_SERVICE_URL: '<url-provided-in-cloud-run>',
```

## Run Locally

If everything is set up, then just run from the main project directory

`npm start`

Then in your browser, go to

`localhost:8080`

## Deploying to Google App Engine (NOT RECOMMENDED)

If you want to deploy to Google's App Engine, you can do the following, but it is NOT RECOMMENDED, since it can be much more expensive than Heroku.

```
gcloud app deploy
gcloud app browse
gcloud app logs tail -s default
```

## Deploying to Heroku and Github (RECOMMENDED)

Create a repo in Github

Set up an SSH key in Github settings for easier deployment without authentication

Create an app in Heroku

In Heroku Deploy settings, connect the app to your Github repo, and enable automatic deploys

Deploy using Git from the commandline
```
git init
git add .
git commit -m update
git remote add origin https://github.com/<github-name>/<repo-name>.git
git push -u origin master
```

## Check Billing

To ensure that you will not incur charges, periodically check the billing projection for the month in the web console

[console.cloud.google.com/billing](https://console.cloud.google.com/billing)
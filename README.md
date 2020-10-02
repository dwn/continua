# continua

### conlang creation utility

## Initial

We're going to set up the auxillary services on Google Cloud, such as Storage and a Cloud Run service that converts font formats

For the main Node.js app, we'll use Heroku, which is not cheap, but which has a more stable pricing structure, is very easy to use, and is well-integrated with Git

Create a new project in [console.cloud.google.com](https://console.cloud.google.com) - set project id as you wish

Install Google Cloud SDK - if it was installed at sometime in the past, you may want to update

`gcloud components update`

From commandline, run

```
gcloud auth login
gcloud config set project <project-id>
```
(Replace `<project-id>`)

If at any time you forget your project id, you can check with

`gcloud config get-value project`

Also set your default region

`gcloud config set run/region <region>`

WARNING: Selecting certain regions may invalidate free-of-charge service, and then you may get a high bill - I use `us-central1`, since it's been safe for me

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

Enable bucket permissions with CORS, which allows transactions with other web addresses

```
gsutil cors set cors.json gs://<bucket-name>
```

Add `allUsers` with role `Owner` - you can use this line

```
gsutil defacl ch -u allUsers:OWNER gs://<bucket-name>
```

In Storage Lifecycle Rules, create a rule `Delete object` when `Age` is 1 day

The console should show that Public Access is `Subject to ACLs`

Access Control should be `Fine-grained: Object-level ACLs enabled`

NOTE: Fine-grained control isn't really required, but, as I'm not particularly knowledgeable about the higher-level IAM permissions, and don't particularly care, I just use the ACL permissions

## Set up Github

If you haven't already, set up an SSH key in Github settings for easier deployment without authentication

[github.com/settings/keys](https://github.com/settings/keys)

In Github, fork the Continua project to your own user account

## Set up Cloud Run

Now we will create the background service that converts SVG font files into OTF files

Go to Cloud Run and create a service

[console.cloud.google.com/run](https://console.cloud.google.com/run)

Choose a service name

Authentication `Allow unauthenticated invocations`

Configure the service's first revision `Deploy one revision...`

Container image URL `gcr.io/<project-id>/<service-name>`

You should see a message 'image not found' - that's okay, no image has yet been deployed

Enable Continuous Deployment - you'll be asked to log into Github

Select any other options required to enable Continuous Deployment

Set your Dockerfile path as `fontforge-container/Dockerfile`

Logs are viewable in the console

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

Set the following in `fontforge-container/app.py`

```
bucket_name = '<bucket-name>'
```

## Run Locally

If everything is set up, then just run from the main project directory

`npm start`

Then in your browser, go to

`localhost:8080`

### Open Port

Open Google Cloud firewall port for socket communication - this is used by the chat feature

```
gcloud compute firewall-rules create default-allow-websockets --allow tcp:65080 --target-tags websocket --description "Allow websocket traffic on port 65080"
```

If it asks you to enable, say yes

## Deploying to Heroku

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

To view logs
```
heroku logs --tail -a <app-name>
```

## Check Billing

To ensure that you will not incur unexpected charges, periodically check the billing projection for the month

[console.cloud.google.com/billing](https://console.cloud.google.com/billing)

[dashboard.heroku.com/account/billing](https://dashboard.heroku.com/account/billing)

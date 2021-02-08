# continua

### conlang creation utility

## Initial

We're going to set up the auxillary services on Google Cloud, such as Storage and Cloud Run services

For the main Node.js app, we'll use Heroku, which has a stable pricing structure, is very convenient to use, and is well-integrated with Git

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

## HTTPS authentication

To generate an SSL authentication key and certificate

```
openssl genrsa -out key.pem
openssl req -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```

Place these files in a non-visible directory and set `AUTHENTICATION_DIR` in `cfg.json` to that location

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

In the console permissions for your bucket, add `allUsers` with role `Storage Object Owner`

Create a Lifecycle Rule `Delete object` when `Age` is 1 day

`gsutil lifecycle set lifecycle.json gs://<bucket-name>`

The console should show that Public Access is `Subject to ACLs`

Access Control should be `Fine-grained: Object-level ACLs enabled`

[console.cloud.google.com/storage](https://console.cloud.google.com/storage)

NOTE: Fine-grained control isn't really required, but, as I'm not particularly knowledgeable about the higher-level IAM permissions, and don't particularly care, I just use the ACL permissions

## Set up GitHub

If you haven't already, set up an SSH key in GitHub settings for easier deployment without authentication

[github.com/settings/keys](https://github.com/settings/keys)

From GitHub, clone this project

## Set up Cloud Run

Now we will create the background service - this will install a Docker container with programs used for processing files, coverting file formats, etc.

Go to Cloud Run and create a service

[console.cloud.google.com/run](https://console.cloud.google.com/run)

Choose a service name

Authentication `Allow unauthenticated invocations`

Configure the service's first revision `Deploy one revision...`

Container image URL `gcr.io/<project-id>/<service-name>`

You should see a message 'image not found' - that's okay, no image has yet been deployed

Enable Continuous Deployment - you'll be asked to log into GitHub

Select any other options required to enable Continuous Deployment

Set your Dockerfile path as `service-container/Dockerfile`

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

Set the following in `service-container/app.py`

```
bucket_name = '<bucket-name>'
```

## Run Locally

If everything is set up, then just run from the main project directory

`npm start`

Then in your browser, go to

`localhost:8080`

## Deploying to Heroku

Create an app in Heroku

In Heroku Deploy settings, select `Deployment method` as `GitHub` and find your GitHub project

Enable `Automatic deploys` from `master`

Even though we've enabled ACL and CORS, we still must also set up credentials that will permit Heroku services to talk to Google Cloud Storage through the API - whew! using Storage is a lot of work

Under your Heroku project's `Settings`, create two `Config Vars`

Name the first `GCP_CRED`

Copy and paste the data from your Google Cloud credential JSON file

Name another variable `GOOGLE_APPLICATION_CREDENTIALS`, and assign it the value `./gcp.json`

Also under Settings, check that the buildpack is `Node.js`, and delete any other buildpacks that may've been installed instead

Connect your files to the git repo using

```
git init && git remote add origin https://github.com/<github-name>/<repo-name>.git
```

Then to deploy new code, just use

```
git add . && git commit --allow-empty -m update && git push -u origin master
```

To view logs
```
heroku logs --tail -a <app-name>
```

Your app should be visible at `<heroku-app-name>.herokuapp.com`

## Check Billing

To ensure that you will not incur unexpected charges, periodically check the billing projection for the month

[console.cloud.google.com/billing](https://console.cloud.google.com/billing)

[dashboard.heroku.com/account/billing](https://dashboard.heroku.com/account/billing)

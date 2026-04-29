# Google Cloud Deployment Script for Vote Mithra

# Load environment variables from .env
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^(?<name>[^=]+)=(?<value>.*)$') {
            $name = $Matches['name'].Trim()
            $value = $Matches['value'].Trim()
            Set-Item "env:$name" $value
        }
    }
}

$PROJECT_ID = "election-app-494517"
$REGION = "us-central1"
$SERVICE_NAME = "vote-mithra"

Write-Host "Building and Deploying to Google Cloud Run..." -ForegroundColor Cyan

# Check if gcloud is installed - Add common search path if not found
if (!(Get-Command gcloud -ErrorAction SilentlyContinue)) {
    $gcloudPath = "C:\Users\guru6\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin"
    if (Test-Path "$gcloudPath\gcloud.cmd") {
        $env:Path += ";$gcloudPath"
        Write-Host "Found gcloud in AppData, adding to temporary path..." -ForegroundColor Gray
    } else {
        Write-Error "gcloud CLI not found. Please install Google Cloud SDK."
        exit
    }
}

# Set Project
gcloud config set project $PROJECT_ID

# Submit build to Cloud Build
# We pass all VITE_ variables as substitutions
gcloud builds submit --config cloudbuild.yaml `
    --substitutions="_GEMINI_API_KEY=$env:VITE_GEMINI_API_KEY,_MAPS_API_KEY=$env:VITE_MAPS_API_KEY,_FIREBASE_API_KEY=$env:VITE_FIREBASE_API_KEY,_FIREBASE_AUTH_DOMAIN=$env:VITE_FIREBASE_AUTH_DOMAIN,_FIREBASE_DATABASE_URL=$env:VITE_FIREBASE_DATABASE_URL,_FIREBASE_PROJECT_ID=$env:VITE_FIREBASE_PROJECT_ID,_FIREBASE_STORAGE_BUCKET=$env:VITE_FIREBASE_STORAGE_BUCKET,_FIREBASE_MESSAGING_SENDER_ID=$env:VITE_FIREBASE_MESSAGING_SENDER_ID,_FIREBASE_APP_ID=$env:VITE_FIREBASE_APP_ID,_RECAPTCHA_SITE_KEY=$env:VITE_RECAPTCHA_SITE_KEY"

Write-Host "Deployment complete!" -ForegroundColor Green

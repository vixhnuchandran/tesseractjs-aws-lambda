# Deploying Tesseract.js on AWS Lambda with Layers

This guide will walk you through deploying a Tesseract.js-based application on AWS Lambda, utilizing AWS Lambda layers for dependency management.

## Prerequisites

- AWS account with appropriate permissions to create Lambda functions, layers, and access S3.
- Node.js installed locally.
- AWS CLI configured with your AWS account credentials.

## Project Structure

Your project directory should have the following structure:

```bash
    tesseractjs-aws-lambda/
    ├── eng.traineddata
    ├── index.mjs
    ├── modules-layer.zip
    ├── package.json
    └── README.md
```

# Steps to Deploy

## 1. Create an AWS Lambda Layer

1. Zip the contents of the `nodejs` directory (`node_modules` with `tesseract.js` symlink) into a file named `modules-layer.zip`.
2. Check the size of the `modules-layer.zip`. If it's above 10MB, proceed with uploading it to Amazon S3.
   - If the size exceeds 10MB:
     - Go to the AWS S3 console.
     - Click on "Create bucket" if you don't have a suitable bucket already.
     - Upload `modules-layer.zip` to your S3 bucket.
     - Make sure to note the object URL of the uploaded file.
3. Go to the AWS Lambda console.
4. Click on "Layers" in the left navigation pane.
5. Click on the "Create layer" button.
6. Provide a name and description for your layer.
7. If you uploaded the layer to S3, paste the object URL in the "Compatible layers" section. If not, proceed with direct upload.
8. Click on "Create" to create the layer.
9. Note the ARN (Amazon Resource Name) of the created layer.

## 2. Deploy the Lambda Function

1. Ensure you have the AWS CLI installed and configured.
2. Run the following command to deploy your Lambda function:

   ```bash
   aws lambda create-function --function-name my-tesseract-function --zip-file fileb://index.zip --handler index.handler --runtime nodejs20.x --layers <YOUR_LAYER_ARN>
   ```

   Replace `<YOUR_LAYER_ARN>` with the ARN of the layer you created.

   This command will create a Lambda function named `my-tesseract-function` using `index.zip` as the deployment package, `index.handler` as the handler function, and Node.js 20.x as the runtime.

## 3. Test the Lambda Function

- You can test your Lambda function using the AWS Lambda console or AWS CLI.
- Ensure to provide input data suitable for your Tesseract.js OCR process.

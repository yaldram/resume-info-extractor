# Resume Info Extractor

Resume Info Extractor is a serverless application that automatically extracts information from PDF resumes uploaded to an Amazon S3 bucket. It utilizes AWS Lambda, OpenAI API, and MongoDB Atlas to process and store structured data from resumes. The project is bootstrapped using AWS SAM CLI and includes a Lambda layer for `pdf-dist` node_module for handling PDF extraction.

## How it works
![workflow](https://pub-2e209747425f40cdacae2d98eae729f3.r2.dev/resume-extractor.png)
- **Upload a PDF**: Resumes are uploaded to an S3 bucket, which triggers a Lambda.
- **Automatic Processing**: Lambda function extracts data using OpenAI API and stores it in MongoDB.
- **Retrieve Candidate Info**: Extracted details include:
    - Personal Info: Name, Email, Phone Number
    - Experience: Total years, Employment History
    - Education: Degrees, Schools, Timelines
    - Skills & Languages

## Prerequisites

-   AWS account with appropriate permissions.
-   SAM CLI installed locally: [AWS SAM CLI Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
-   MongoDB Atlas cluster URL (MONGO_URI) for storing extracted data.
-   OpenAI API key for utilizing the OpenAI API (OPENAI_API_KEY).

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yaldram/resume-extractor.git
    cd resume-extractor
    ```
2.  Install dependencies and build the project using SAM CLI: 
    ```bash
    npm install
    sam build
    ```
4.  Deploy the application using SAM CLI:
    ```bash
    sam deploy --guided
    ``` 

## Environment Variables

Set the following environment variables in your AWS Lambda environment:

-   `MONGO_URI`: MongoDB Atlas cluster URL for storing extracted data.
-   `OPENAI_API_KEY`: OpenAI API key for accessing the OpenAI API.

## Folder Structure

- `extractor`: Lambda function for PDF parsing and data extraction.
- `pdfdist-layer/`: Lambda layer containing `pdf-dist` module to handle PDF extraction.

## SAM Template

The SAM template.yml file is provided to configure AWS resources and permissions required for the application. We created the following resources - 
-   **S3 Bucket (`ResumeBucket`):**
    -   Stores uploaded PDF resumes.
-   **Lambda Layer (`PdfdistLayer`):**
    -   Layer for the `pdf-dist` node module.
-   **Lambda Function (`ResumeInfoExtracterFunction`):**
    -   Extracts information from uploaded PDF resumes.
    -   Triggered by S3 bucket upload events for `.pdf` files.
    -   Uses `PdfdistLayer` for PDF extraction.
    -   Requires read access to the specified S3 bucket (`ResumeBucketName` parameter).

## Issues and Troubleshooting

If you encounter issues, please check the [Issues section](https://github.com/yaldram/resume-extractor/issues) of this repository to see if the problem has already been reported. If not, please feel free to create a new issue.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's coding standards and test your changes thoroughly before submitting.

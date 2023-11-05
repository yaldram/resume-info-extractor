import { Callback, Context, S3Event } from 'aws-lambda';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { extractTextFromPdf } from './utils/pdf';
import { extractInfo } from './utils/openai';
import { connectToDb, resumeCollection } from './utils/dbClient';

const s3 = new S3Client({ region: 'ap-south-1' });

export const lambdaHandler = async (event: S3Event, context: Context, callback: Callback) => {
    console.log('LogScheduledEvent');

    const bucketName = event.Records[0].s3.bucket.name;
    const fileKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    // Read the file from S3
    const commandGet = new GetObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
    });

    const s3Object = await s3.send(commandGet);

    if (!s3Object.Body) {
        callback(new Error('unable to retrive S3 Object Body'));
        return;
    }

    // Convert the S3 object data to a typed array
    const typedArray = await s3Object.Body.transformToByteArray();

    const resumeTextContent = await extractTextFromPdf(typedArray);

    const resumeInfo = await extractInfo(resumeTextContent);

    if (!resumeInfo) {
        callback(new Error('unable to extract info from the resume'));
        return;
    }

    const resumeInfoJson = JSON.parse(resumeInfo);

    // Connect to mongodb
    await connectToDb();

    // add the resume data to mongodb
    await resumeCollection.insertOne({
        bucketName: bucketName,
        fileName: fileKey,
        data: resumeInfoJson,
    });

    callback(null, 'Finished');
};

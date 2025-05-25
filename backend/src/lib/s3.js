import { S3Client } from "@aws-sdk/client-s3";
import { config } from "dotenv";

config();

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.S3_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secret = process.env.AWS_SECRET_KEY


const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secret
    },
    region: region
});

export default s3Client;
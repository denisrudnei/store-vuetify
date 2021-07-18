import AWS from 'aws-sdk'

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET,
})

export { S3 }

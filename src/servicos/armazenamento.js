const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
})

const uploadArquivo = async (path, buffer, mimetype) => {
    try {
        const arquivo = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: 'imagens/${file.originalname},
            Body: file.buffer,
            ContentType: file.mimetype
        }).promise();

        return res.json({
            url: arquivo.Location
            path: arquivo.Key
        })
    } catch (error) {
        console.error('Erro no upload do arquivo:', error);
        throw error;
    };
}



module.exports = {
    uploadArquivo,
}
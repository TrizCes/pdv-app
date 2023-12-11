const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  endpoint: process.env.ENDPOINT_S3,
  region: process.env.REGION_S3,
  credentials: {
    accessKeyId: process.env.KEY_ID,
    secretAccessKey: process.env.APP_KEY,
  },
});

const uploadArquivo = async (path, buffer, mimetype) => {
  const urlDoBucket = process.env.BACKBLAZE_BUCKET;
  const urlDaRegiao = process.env.REGION_S3;
  const pathArquivo = `pdv/produtos/${new Date().toISOString() + path.toString().replace(' ', '')}`;
  try {
    const arquivo = new PutObjectCommand({
      Bucket: urlDoBucket,
      Key: pathArquivo,
      Body: buffer,
      ContentType: mimetype,
    });
    await s3.send(arquivo);

    const urlDaImagem = `https://${urlDoBucket}.s3.${urlDaRegiao}.${process.env.URL_S3}/${pathArquivo}`;

    return urlDaImagem;
  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    throw error;
  }
};

module.exports = {
  uploadArquivo,
};

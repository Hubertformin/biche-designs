const ImageKit = require("imagekit");
const cors = require('micro-cors')();

const handler = (req, res) => {
    const imageKit = new ImageKit({
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: "https://ik.imagekit.io/biche/"
    });
    const authenticationParameters = imageKit.getAuthenticationParameters();

    res.json(authenticationParameters);
};

export default cors(handler);

import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    await isAdminRequest(req, res);

    if(method === 'GET'){
        if (req.query?.id){
            res.json(await Product.findOne({_id: req.query.id}));
        } else {
            res.json(await Product.find());
        }
    }

    if(method === 'POST'){
        const {title, description, price, images, category, properties} = req.body;
        const productDoc = await Product.create({
            title, description, price, images, category, properties,
        })
        res.json(productDoc);
    }

    if(method === 'PUT') {
        const {title, description, price, images, category, properties, _id} = req.body;
        await Product.updateOne({_id}, {title, description, price, images, category, properties});
        res.json(true);
    }

    if(method === 'DELETE') {
        const {id, imageUrl} = req.query;
        if (id) {
            if (imageUrl) {
                // This block will handle deletion of a specific image from a product
                const product = await Product.findOne({ _id: id });
                const updatedImages = product?.images.filter(image => image !== imageUrl);
                
                product.images = updatedImages;
                res.json(true);
            } else {
                // This block will handle deletion of the whole product
                await Product.deleteOne({ _id: id });
                res.json(true);
            }
        }
    }
}
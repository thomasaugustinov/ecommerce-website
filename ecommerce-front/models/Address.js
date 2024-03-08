const { default: mongoose, models, model, Schema } = require("mongoose");

const AddressSchema = new Schema({
    userEmail: {type: String, unique: true, required: true},
    name: String,
    email: String,
    country: String,
    state: String,
    city: String,
    postalCode: String,
    streetAddress: String,
});

export const Address = models?.Address || model('Address', AddressSchema);
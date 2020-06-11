import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from './product.model';
import { InjectModel} from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    private products: Product[] = [];

    // model injected
    constructor(@InjectModel('Product') private readonly productModel: Model<Product> ){}

        async insertProduct(title: string, desc: string, price: number){

        const newProduct = new this.productModel({ title: title, desc: desc, price: price});
        const result = await newProduct.save();
        console.log(result);
        return result.id as string;

    }

    async getProducts() {
        const products = await this.productModel.find().exec();
        console.log([products]);
        return products.map((prod) => ({id: prod.id, title: prod.title, description: prod.desc, price: prod.price}));

       
    }

    async getSingleProduct(productId: string){
        const product = await this.findProduct(productId);
        return product // for returning a copy of product

    }

    async updateProduct(productId: string,
        title: string,
        desc: string,
        price: number 
        ){
            const updatedProduct = await this.findProduct(productId)
            if(title){
                updatedProduct.title = title;
            }  
            if(desc){
                updatedProduct.desc = desc;
            }  
            if(price){
                updatedProduct.price= price;
            }  
           updatedProduct.save()

        }  

    async deleteProduct(prodId: string){
        await this.productModel.deleteOne({_id: prodId}).exec();
    }    

    private async findProduct(id: string): Promise<Product>{
        let product;
        try{
            product = await this.productModel.findById(id);
        }
        catch(err){
            throw new NotFoundException('Could not find product');
        }
       
        if(!product){
            throw new NotFoundException('Could not find product');
        }
        return product;
    }    
}
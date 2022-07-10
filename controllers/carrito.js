const mongoose = require('mongoose');
const carritoSchema = require('../DB/carritoSchema');
const Product = require('./productos');
const product = new Product();
const {newOrder} = require('../utils/nodemailer');
const { newOrderWp } = require('../utils/twilio');
require('dotenv').config();

class Car{

    constructor(){
       
    }

    async connectDB(){
        try{
            const URL = process.env.URLDB;
            let connect = await mongoose.connect(URL,{
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }catch (e){
            console.log(e);
        }
    }

    async createCar(){
        try{
            const car = {
                id : 1,
                timestamp : Date.now(),
                productos : []
            };
            await this.connectDB();
            // const lastCar = await carritoSchema.find().sort({id:-1}).limit(1);
            // if(lastCar.length !== 0){
            //     car.id = lastCar[0].id + 1;
            // }else{
            //     car.id = 1;
            // }
            // car.timestamp = Date.now();
            // car.productos = [];
            await carritoSchema.create(car);
            mongoose.disconnect();
            return 'Carrito creado con exito';
        }catch (e){
            return `Ha ocurrido el siguiente error: ${e}`;
        }
    }

    async delCar(id){
        try{
            await this.connectDB();
            const car = await carritoSchema.find({id:id});
            if(car.length !== 0){
                await carritoSchema.deleteOne({id:id});
                mongoose.disconnect();
                return 'Carrito eliminado con exito';
            }else{
                mongoose.disconnect();
                return `No existe el carrito con id ${id}`
            }
        }catch (e){
            return `Ha ocurrido el siguiente error: ${e}`;
        }
    }

    async listCar(id){
        try{
            await this.connectDB();
            const carrito = await carritoSchema.find({id:id});
            mongoose.disconnect();
            return carrito[0];
        }catch (e){
            return `Ha ocurrido el siguiente error: ${e}`;
        }
    }

    async addProdCar(idCar,idProduct){
        try{
            await this.connectDB();
            let carritoId = await this.listCar(idCar);
            let productoId = await product.getProdById(parseInt(idProduct));
            mongoose.disconnect();

            if(carritoId && productoId){
                await this.connectDB();
                productoId.timestamp = Date.now();
                await carritoSchema.updateOne({id: carritoId.id},{$push: {
                    productos: productoId
                }});
                mongoose.disconnect();
                console.log(`Producto agregado al carrito ${idCar} con exito`);
                return `Producto agregado al carrito ${idCar} con exito`;
            }else{
                console.log('No existe el producto o el carrito');
                return 'No existe el producto o el carrito';                                                                                                                                                                                                                                                                                                                                                                  }
        }catch (e){
            console.log(e);
            return `Ha ocurrido el siguiente error: ${e}`;
        }
    }
        
    async deleteProdCar(idCar,idProduct){
        try{
            await this.connectDB();
            let carritoId = await this.listCar(idCar);
            mongoose.disconnect();
            
            if(carritoId){
                const productoId = carritoId.productos.find((producto) => producto.timestamp == idProduct);
                if(productoId){
                    await this.connectDB();
                    await carritoSchema.updateOne({id: carritoId.id},{$pull: {
                        productos: {timestamp : productoId.timestamp}
                    }});
                    mongoose.disconnect();
                    return `Producto eliminado del carrito ${idCar} con exito`;
                }else{
                    return `No existe el producto que se desea eliminar`;
                }
            }else{
                return `No existe el carrito numero ${idCar}`;
            }
        }catch (e){
            return `Ha ocurrido el siguiente error: ${e}`;
        }
    }

    async carFin(nombre,email){
        try{
            const carrito = await this.listCar(1);
            await newOrder(nombre,email,carrito);
            await newOrderWp(nombre,email,carrito);
            await this.delCar(1);
            return 'Pedido realizado con exito';
        }catch(e){
            console.log(e);            
        }
    }

}

module.exports = Car;
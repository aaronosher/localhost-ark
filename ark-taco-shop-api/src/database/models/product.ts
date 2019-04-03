import Sequelize from "sequelize";

export interface ProductAttributes {
    id?: number;
    code: string;
    description: string;
    imageUrl: string;
    name: string;
    price: number;
    quantity: number;
}

export interface PartialProductAttributes {
    id?: number;
    code?: string;
    description?: string;
    imageUrl?: string;
    name?: string;
    price?: number;
    quantity?: number;
}

export type ProductInstance = Sequelize.Instance<ProductAttributes> & ProductAttributes;
export type ProductModel = Sequelize.Model<ProductInstance, ProductAttributes>;

export function initProduct(sequalize: Sequelize.Sequelize): ProductModel {
    const attributes: SequelizeAttributes<ProductAttributes> = {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: Sequelize.TEXT,
        imageUrl: Sequelize.STRING,
        code: {
            type: Sequelize.STRING,
            unique: true,
        },
        price: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    };
    const Product = sequalize.define<ProductInstance, ProductAttributes>("product", attributes);
    return Product;
}

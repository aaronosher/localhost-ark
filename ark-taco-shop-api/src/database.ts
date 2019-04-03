import { ensureFileSync, existsSync, removeSync } from "fs-extra";
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import uuidv4 from "uuid/v4";

class Database {
    private database: lowdb.LowdbSync<any>;

    public make(): void {
        const adapterFile: string = `${process.env.CORE_PATH_CACHE}/taco-shop/products.json`;

        if (!existsSync(adapterFile)) {
            ensureFileSync(adapterFile);
        }

        this.database = lowdb(new FileSync(adapterFile));
        this.database.defaults({ products: [] }).write();
    }

    public paginate(params) {
        const rows = this.database
            .get("products", [])
            .slice(params.offset, params.offset + params.limit)
            .value();

        return { rows, count: rows.length };
    }

    public findById(id) {
        return this.database
            .get("products")
            .find({ id })
            .value();
    }

    public findByCode(code) {
        return this.database
            .get("products")
            .find({ code })
            .value();
    }

    public create(data) {
        data.id = uuidv4();

        this.database
            .get("products")
            .push(data)
            .write();

        return this.findById(data.id);
    }

    public update(id, data) {
        return this.database
            .get("products")
            .find({ id })
            .assign(data)
            .write();
    }

    public destroy(id) {
        try {
            return this.database
                .get("products")
                .remove({ id })
                .write();
        } catch (error) {
            return false;
        }
    }

    public reset(): void {
        removeSync(`${process.env.CORE_PATH_CACHE}/taco-shop/products.json`);

        this.make();
    }
}

export const database = new Database();

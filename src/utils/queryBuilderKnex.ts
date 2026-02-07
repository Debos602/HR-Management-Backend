import { Knex } from 'knex';

export interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export class QueryBuilderKnex {
    private knex: Knex;
    private table: string;
    private query: Record<string, any>;

    constructor(knex: Knex, table: string, query: Record<string, any>) {
        this.knex = knex;
        this.table = table;
        this.query = query || {};
    }

    private applySearch(qb: Knex.QueryBuilder) {
        const searchTerm = this.query.search as string || this.query.searchTerm || this.query.q;
        const searchFields = (this.query.searchFields as string[]) || [];
        if (searchTerm && searchFields.length > 0) {
            qb.where((builder) => {
                for (const f of searchFields) {
                    builder.orWhereILike(f, `%${searchTerm}%`);
                }
            });
        }
    }

    private applyFilters(qb: Knex.QueryBuilder) {
        const queryObj = { ...this.query };
        const exclude = ['search', 'searchTerm', 'searchFields', 'sort', 'limit', 'page', 'fields', 'q'];
        for (const e of exclude) delete queryObj[e];

        Object.entries(queryObj).forEach(([key, value]) => {
            const match = key.match(/^(.+?)\[(.+)\]$/);
            if (match) {
                const [, field, op] = match;
                const val = this.parseValue(op, value);
                switch (op) {
                    case 'gt':
                        qb.andWhere(field, '>', val);
                        break;
                    case 'gte':
                        qb.andWhere(field, '>=', val);
                        break;
                    case 'lt':
                        qb.andWhere(field, '<', val);
                        break;
                    case 'lte':
                        qb.andWhere(field, '<=', val);
                        break;
                    case 'ne':
                        qb.andWhere(field, '!=', val);
                        break;
                    case 'in':
                        qb.andWhere(field, 'in', Array.isArray(val) ? val : String(val).split(','));
                        break;
                    default:
                        qb.andWhere(field, val);
                }
            } else {
                qb.andWhere(key, value as any);
            }
        });
    }

    private parseValue(op: string, value: any) {
        if (['gt', 'gte', 'lt', 'lte'].includes(op)) {
            const n = Number(value);
            if (!isNaN(n)) return n;
            const d = new Date(value);
            if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
        }
        return value;
    }

    private applySort(qb: Knex.QueryBuilder) {
        const sortRaw = this.query.sort as string;
        if (sortRaw) {
            const parts = sortRaw.split(',').map((s) => s.trim());
            for (const p of parts) {
                if (p.startsWith('-')) qb.orderBy(p.slice(1), 'desc');
                else qb.orderBy(p, 'asc');
            }
        } else {
            qb.orderBy('created_at', 'desc');
        }
    }

    private applyFields(qb: Knex.QueryBuilder) {
        const fields = this.query.fields as string;
        if (fields) {
            const cols = fields.split(',').map((s) => s.trim());
            qb.select(cols);
        } else {
            qb.select('*');
        }
    }

    private applyPagination(qb: Knex.QueryBuilder) {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const offset = (page - 1) * limit;
        qb.limit(limit).offset(offset);
    }

    async exec(searchFields: string[] = []): Promise<{ data: any[]; meta: Meta; }> {
        // data query
        const dataQb = this.knex(this.table);
        if (searchFields.length) this.applySearch(dataQb);
        this.applyFilters(dataQb);
        this.applySort(dataQb);
        this.applyFields(dataQb);

        // capture page/limit before pagination
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;

        this.applyPagination(dataQb);

        const data = await dataQb;

        // count query
        const countQb = this.knex(this.table).count<{ count: string; }[]>({ count: '*' } as any);
        if (searchFields.length) this.applySearch(countQb);
        this.applyFilters(countQb);
        const countRes = await countQb.first();
        const total = Number((countRes && (countRes as any).count) || 0);
        const totalPage = Math.ceil(total / limit) || 0;

        return { data, meta: { page, limit, total, totalPage } };
    }
}

export default QueryBuilderKnex;

export interface ColumnDefinition {
  sqlType: string;
  isPrimary: boolean;
  isNullable: boolean;
  defaultValue?: string | number | boolean;
  isAutoIncrement: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EntityDefinition<T extends {} = {}> {
  tableName: string;
  columns: Record<keyof T, ColumnDefinition>;
}

class ColumnBuilder {
  private definition: ColumnDefinition;

  constructor(sqlType: string) {
    this.definition = {
      sqlType,
      isPrimary: false,
      isNullable: false,
      defaultValue: undefined,
      isAutoIncrement: false,
    };
  }

  primary(): this {
    this.definition.isPrimary = true;
    return this;
  }

  nullable(): this {
    this.definition.isNullable = true;
    return this;
  }

  default(value: string | number | boolean): this {
    this.definition.defaultValue = value;
    return this;
  }

  autoIncrement(): this {
    this.definition.isAutoIncrement = true;
    return this;
  }

  build(): ColumnDefinition {
    return { ...this.definition };
  }
}

export const column = {
  text: () => new ColumnBuilder("TEXT"),
  integer: () => new ColumnBuilder("INTEGER"),
  real: () => new ColumnBuilder("REAL"),
  boolean: () => new ColumnBuilder("INTEGER"),
  timestamp: () => new ColumnBuilder("TEXT"),
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function defineEntity<T extends {}>(config: {
  tableName: string;
  columns: Record<keyof T, ColumnBuilder>;
}): EntityDefinition<T> {
  const columns = {} as Record<keyof T, ColumnDefinition>;

  for (const [key, builder] of Object.entries(config.columns)) {
    columns[key as keyof T] = (builder as ColumnBuilder).build();
  }

  return {
    tableName: config.tableName,
    columns,
  };
}

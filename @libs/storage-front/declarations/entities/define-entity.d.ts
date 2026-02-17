export interface ColumnDefinition {
  sqlType: string;
  isPrimary: boolean;
  isNullable: boolean;
  defaultValue?: string | number | boolean;
  isAutoIncrement: boolean;
}
export interface EntityDefinition<T extends {} = {}> {
  tableName: string;
  columns: Record<keyof T, ColumnDefinition>;
}
declare class ColumnBuilder {
  private definition;
  constructor(sqlType: string);
  primary(): this;
  nullable(): this;
  default(value: string | number | boolean): this;
  autoIncrement(): this;
  build(): ColumnDefinition;
}
export declare const column: {
  text: () => ColumnBuilder;
  integer: () => ColumnBuilder;
  real: () => ColumnBuilder;
  boolean: () => ColumnBuilder;
  timestamp: () => ColumnBuilder;
};
export declare function defineEntity<T extends {}>(config: {
  tableName: string;
  columns: Record<keyof T, ColumnBuilder>;
}): EntityDefinition<T>;
export {};
//# sourceMappingURL=define-entity.d.ts.map

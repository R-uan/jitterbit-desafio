export interface IPatchOrderRequest {
  valorTotal?: number;
  dataCriacao?: Date;

  removeItems?: number[];
  updateItems?: {
    idItem: number;
    valorItem?: number;
    quantidadeItem?: number;
  }[];
  addItems?: {
    idItem: number;
    valorItem: number;
    quantidadeItem: number;
  }[];
}

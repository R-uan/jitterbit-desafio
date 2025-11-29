export interface ICreateOrderRequest {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: Date; // This is a string in body
  items: {
    idItem: number; // this is a string in body
    valorItem: number;
    quantidadeItem: number;
  }[];
}

export interface ICreateOrderRequest {
  numeroPedido: string;
  valorTotal: number;
  dataCriacao: Date;
  items: {
    iditem: number;
    valorItem: number;
    quantidadeItem: number;
  }[];
}

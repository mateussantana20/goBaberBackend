import ISendMailDTO from '../dtos/ISendMailDTO'

export default interface IMailtProvider {
  sendMail(data: ISendMailDTO): Promise<void>;
}

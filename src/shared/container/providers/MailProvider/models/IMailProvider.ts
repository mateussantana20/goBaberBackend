export default interface IMailtProvider {
  sendMail(to: string, body: string): Promise<void>;
}

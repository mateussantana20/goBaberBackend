export default interface IStorageProvider {
  saveFile(file: string): Promise<string>;
  daleteFile(file: string): Promise<void>;
}

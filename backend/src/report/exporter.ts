export abstract class Exporter {
  /**
   * Template Method – never override.
   * 1. Fetch domain data
   * 2. Transform → Buffer
   */
  async export(eventId: string): Promise<Buffer> {
    const raw = await this.fetch(eventId); // step 1 (hook)
    const bytes = await this.serialize(raw); // step 2 (hook)
    return bytes;
  }

  /** Hook: get data from DB / service */
  protected abstract fetch(eventId: string): Promise<any>;

  /** Hook: convert data to CSV, PDF, etc. */
  protected abstract serialize(raw: any): Promise<Buffer>;
}

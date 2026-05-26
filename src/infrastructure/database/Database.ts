export class Database {
  private static instance: Database | null = null;
  private connected: boolean = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) return;
    // En prod : connexion PostgreSQL ici
    this.connected = true;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  /** Utile pour les tests : réinitialiser le singleton */
  static resetInstance(): void {
    Database.instance = null;
  }
}

export {};

declare global {
  interface Window {
    api: {
      members: {
        find: (query: any) => Promise<any[]>;
        insert: (doc: any) => Promise<any>;
        update: (id: string, update: any) => Promise<number>;
        remove: (id: string) => Promise<number>;
      };
      plans: {
        find: (query: any) => Promise<any[]>;
        insert: (doc: any) => Promise<any>;
        update: (id: string, update: any) => Promise<number>;
        remove: (id: string) => Promise<number>;
      };
      payments: {
        find: (query: any) => Promise<any[]>;
        insert: (doc: any) => Promise<any>;
        update: (id: string, update: any) => Promise<number>;
        remove: (id: string) => Promise<number>;
      };
      checkins: {
        find: (query: any) => Promise<any[]>;
        insert: (doc: any) => Promise<any>;
        update: (id: string, update: any) => Promise<number>;
        remove: (id: string) => Promise<number>;
      };
    };
  }
}
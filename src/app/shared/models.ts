// Data models returned by the Nexus client, kept 1:1 with the 2019 app
// (PascalCase properties come straight from the Nexus wire format).
export class User {
  constructor(
    public User: string,
    public Tags: any,
    public Templates: string[],
    public Whitelist: string[],
    public Blaclist: string[], // sic — legacy field name
    public MaxSessions: number,
    public Disabled: boolean,
  ) {}
}

export class UserSessions {
  constructor(
    public User: string,
    public Sessions: SessionInfo[],
    public N: number,
  ) {}
}

export class SessionInfo {
  constructor(
    public Id: string,
    public NodeId: string,
    public RemoteAddress: string,
    public Protocol: string,
    public CreationTime: number,
  ) {}
}

export class Session {
  constructor(
    public User: string,
    public ConnID: string,
    public RemoteAddress: string,
    public Protocol: string,
    public CreationTime: number,
  ) {}
}

export class Node {
  constructor(
    public NodeId: string,
    public Version: string,
    public Clients: number,
    public Listening: boolean,
    public Load: { Load1: number; Load5: number; Load15: number },
  ) {}
}

export class Task {
  constructor(
    public Id: string,
    public Session: string, // First 16 characters of Id
    public ID: string, // Characters from the 16th of Id
    public Path: string,
    public Method: string,
    public User: string,
    public Stat: string, // Status
    public Tses: string, // Worker
    public Type: string, // Push or Pull
  ) {}
}

export function NewTask(params: any): Task {
  if (params.Method === '') {
    params.Type = 'Pull';
  } else {
    params.Type = 'Push';
  }
  params.Session = params.Id.slice(0, 16);
  params.ID = params.Id.slice(16);
  return new Task(
    params.Id,
    params.Session,
    params.ID,
    params.Path,
    params.Method,
    params.User,
    params.Stat,
    params.Tses,
    params.Type,
  );
}

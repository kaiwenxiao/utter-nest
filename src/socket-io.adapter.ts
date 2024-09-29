import { IoAdapter } from '@nestjs/platform-socket.io';
import type { Adapter } from 'socket.io-adapter';
import type { Namespace, Server, ServerOptions } from 'socket.io';
import { INestApplicationContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';

export class SocketIOAdapter extends IoAdapter {
  private adapterConstructor!: (nsp: Namespace) => Adapter;

  constructor(
    app: INestApplicationContext,
    private readonly configService: ConfigService<Configs, true>,
  ) {
    super(app);
  }

  async connectToRedis() {
    const pubClient = createClient({
      url: this.configService.get('redis.url'),
    });
    const subClient = pubClient.duplicate();

    await Promise.allSettled([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: this.configService.get('app.allowedOrigins'),
    };

    const optionsWithCORS = {
      ...options,
      cors,
    };

    const server = super.createIOServer(port, optionsWithCORS) as Server;

    server.adapter(this.adapterConstructor);

    return server;
  }
}

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>('secured', context.getHandler())

    if (!secured) return true

    const request = context.switchToHttp().getRequest()

    const token = this.extractToken(request)

    if (!token) throw new UnauthorizedException()
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers['authorization']?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
